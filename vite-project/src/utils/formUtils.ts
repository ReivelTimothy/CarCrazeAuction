/**
 * Form data utility for handling file uploads and form data consistently
 */

/**
 * Creates FormData from an object, handling file uploads properly
 */
export const createFormDataFromObject = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
};

/**
 * Checks if data contains file uploads
 */
export const containsFileUploads = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  return Object.values(data).some(value => value instanceof File);
};

/**
 * Converts CreateAuctionData to FormData for API submission
 */
export const prepareAuctionFormData = (auctionData: {
  title: string;
  description: string;
  startingPrice: number;
  status: string;
  category: string;
  vehicle_id: string;
  image?: File | string;
}): FormData => {
  const formData = new FormData();
  
  formData.append('title', auctionData.title);
  formData.append('description', auctionData.description);
  formData.append('startingPrice', String(auctionData.startingPrice));
  formData.append('status', auctionData.status);
  formData.append('category', auctionData.category);
  formData.append('vehicle_id', auctionData.vehicle_id);
  
  if (auctionData.image) {
    formData.append('image', auctionData.image);
  }
  
  return formData;
};
