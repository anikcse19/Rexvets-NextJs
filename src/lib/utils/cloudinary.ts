/**
 * Cloudinary utility functions for URL validation and debugging
 */

export interface CloudinaryUrlInfo {
  isValid: boolean;
  publicId?: string;
  version?: string;
  format?: string;
  transformation?: string;
  error?: string;
}

/**
 * Parse and validate a Cloudinary URL
 */
export const parseCloudinaryUrl = (url: string): CloudinaryUrlInfo => {
  try {
    // Basic URL validation
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'Invalid URL format' };
    }

    // Check if it's a Cloudinary URL
    if (!url.includes('cloudinary.com')) {
      return { isValid: false, error: 'Not a Cloudinary URL' };
    }

    // Parse the URL to extract components
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Cloudinary URL structure: /v{version}/{cloud_name}/{resource_type}/{type}/{public_id}.{format}
    // Example: /v1756573524/rexvets/chat/images/chat_68b310b945eff53f43207200_2025-08-30T17-05-20.webp.webp
    
    if (pathParts.length < 6) {
      return { isValid: false, error: 'Invalid Cloudinary URL structure' };
    }

    const version = pathParts[1]?.replace('v', '');
    const cloudName = pathParts[2];
    const resourceType = pathParts[3];
    const type = pathParts[4];
    const publicIdWithFormat = pathParts.slice(5).join('/');
    
    // Extract format from the end
    const lastDotIndex = publicIdWithFormat.lastIndexOf('.');
    const format = lastDotIndex !== -1 ? publicIdWithFormat.substring(lastDotIndex + 1) : undefined;
    const publicId = lastDotIndex !== -1 ? publicIdWithFormat.substring(0, lastDotIndex) : publicIdWithFormat;

    return {
      isValid: true,
      publicId,
      version,
      format,
      transformation: urlObj.search || undefined
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Failed to parse URL' 
    };
  }
};

/**
 * Check if a Cloudinary URL is accessible by making a HEAD request
 */
export const checkCloudinaryUrlAccess = async (url: string): Promise<{ accessible: boolean; status?: number; error?: string }> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      accessible: response.ok,
      status: response.status
    };
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
};

/**
 * Generate a debug report for a Cloudinary URL
 */
export const debugCloudinaryUrl = async (url: string): Promise<{
  url: string;
  parsed: CloudinaryUrlInfo;
  accessible: boolean;
  status?: number;
  recommendations: string[];
}> => {
  const parsed = parseCloudinaryUrl(url);
  const accessible = parsed.isValid ? (await checkCloudinaryUrlAccess(url)).accessible : false;
  const status = parsed.isValid ? (await checkCloudinaryUrlAccess(url)).status : undefined;
  
  const recommendations: string[] = [];
  
  if (!parsed.isValid) {
    recommendations.push('URL format is invalid - check the Cloudinary URL structure');
  } else if (!accessible) {
    recommendations.push('URL is not accessible - the image may have been deleted or is private');
    recommendations.push('Check if the image exists in your Cloudinary account');
    recommendations.push('Verify that the image is not set to private access');
  }
  
  if (parsed.format && parsed.format.includes('.')) {
    recommendations.push('URL has double file extension - this may cause issues');
  }
  
  return {
    url,
    parsed,
    accessible,
    status,
    recommendations
  };
};

/**
 * Clean up a Cloudinary URL by removing any problematic parameters
 */
export const cleanCloudinaryUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Remove any cache-busting parameters we might have added
    const paramsToRemove = ['_retry', '_t', 'v'];
    paramsToRemove.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    return urlObj.toString();
  } catch {
    return url;
  }
};
