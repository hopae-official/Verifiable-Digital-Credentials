import { decodeMdl } from '@m-doc/decode';

export const parseMDL = (credential: string) => {
  const buffer = hexStringToArrayBuffer(credential);
  const rawMdl = decodeMdl(buffer);

  const parsedData = extractNameSpacesData(rawMdl);
  return parsedData;
};

function extractNameSpacesData(mdl: any): Record<string, string> {
  const result: Record<string, string> = {};

  try {
    // Get the nameSpaces from the first document
    const nameSpaces = mdl.documents[0].issuerSigned.nameSpaces;
    const mdlData = nameSpaces['org.iso.18013.5.1'];
    // Extract elementIdentifier and elementValue pairs
    mdlData.forEach((item: any) => {
      if (item.data.elementIdentifier && item.data.elementValue) {
        result[item.data.elementIdentifier] = item.data.elementValue;
      }
    });
  } catch (error) {
    console.error('Error extracting data:', error);
  }

  return result;
}

function hexStringToArrayBuffer(hex: string) {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
  return bytes.buffer;
}
