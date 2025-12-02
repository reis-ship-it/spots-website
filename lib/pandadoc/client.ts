/**
 * PandaDoc eSign API Client
 * FREE eSign plan with unlimited signatures
 * Documentation: https://developers.pandadoc.com
 */

const PANDADOC_API_BASE = process.env.PANDADOC_API_BASE || 'https://api.pandadoc.com/public/v1';
const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY;

if (!PANDADOC_API_KEY) {
  console.warn('PANDADOC_API_KEY is not set. PandaDoc integration will not work.');
}

interface SendDocumentParams {
  name: string;
  email: string;
  templateId: string;
}

interface PandaDocResponse {
  id?: string;
  uuid?: string;
  status?: string;
  error?: any;
}

/**
 * Send document for signature via PandaDoc API
 */
export async function sendDocumentForSignature({
  name,
  email,
  templateId,
}: SendDocumentParams): Promise<string> {
  if (!PANDADOC_API_KEY) {
    throw new Error('PANDADOC_API_KEY is not configured');
  }

  try {
    // PandaDoc API: Create document from template
    // Documentation: https://developers.pandadoc.com/reference/create-document-from-template
    const response = await fetch(`${PANDADOC_API_BASE}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `API-Key ${PANDADOC_API_KEY}`,
      },
      body: JSON.stringify({
        name: `SPOTS NDA - ${name}`,
        template_uuid: templateId, // PandaDoc uses UUID for templates
        recipients: [
          {
            email,
            first_name: name.split(' ')[0] || name,
            last_name: name.split(' ').slice(1).join(' ') || '',
            role: 'signer',
          },
        ],
        metadata: {
          nda_version: process.env.NDA_VERSION || '1.0',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || 
        errorData.message || 
        `PandaDoc API error: ${response.status} ${response.statusText}`
      );
    }

    const data: PandaDocResponse = await response.json();

    // Extract document ID (PandaDoc uses 'id' or 'uuid')
    const documentId = data.id || data.uuid;

    if (!documentId) {
      throw new Error('No document ID returned from PandaDoc API');
    }

    // Send the document
    await fetch(`${PANDADOC_API_BASE}/documents/${documentId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `API-Key ${PANDADOC_API_KEY}`,
      },
      body: JSON.stringify({
        message: 'Please sign the SPOTS NDA to access the pitch deck.',
      }),
    });

    return documentId;
  } catch (error: any) {
    console.error('PandaDoc API error:', error);
    throw new Error(`Failed to send document via PandaDoc: ${error.message}`);
  }
}

/**
 * Get document status from PandaDoc
 */
export async function getDocumentStatus(documentId: string): Promise<any> {
  if (!PANDADOC_API_KEY) {
    throw new Error('PANDADOC_API_KEY is not configured');
  }

  try {
    const response = await fetch(`${PANDADOC_API_BASE}/documents/${documentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `API-Key ${PANDADOC_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get document status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting document status:', error);
    throw error;
  }
}

