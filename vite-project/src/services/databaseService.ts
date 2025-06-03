import { fetchFromAPI } from './api';

/**
 * Check database integrity
 * @returns Results of the database integrity check
 */
export const checkDatabaseIntegrity = async () => {
  console.log('Checking database integrity...');
  try {
    const results = await fetchFromAPI('/admin/database/check-integrity');
    console.log('Database integrity check successful:', results);
    return results;
  } catch (error) {
    console.error('Failed to check database integrity:', error);
    // Return a default structure in case of error to prevent UI from breaking
    return {
      message: 'Database integrity check encountered an error',
      results: {
        transactions: { total: 0, missingUser: 0, missingAuction: 0 },
        bids: { total: 0, missingUser: 0, missingAuction: 0 },
        auctions: { total: 0, missingVehicle: 0 }
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Fix database integrity issues
 * @returns Results of the database integrity fix operation
 */
export const fixDatabaseIntegrity = async () => {
  console.log('Fixing database integrity issues...');
  try {
    const results = await fetchFromAPI('/admin/database/fix-integrity', 'POST');
    console.log('Database integrity fix successful:', results);
    return results;
  } catch (error) {
    console.error('Failed to fix database integrity issues:', error);
    // Return a default structure in case of error to prevent UI from breaking
    return {
      message: 'Failed to fix database integrity',
      results: {
        transactions: 0,
        bids: 0,
        auctions: 0
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Process expired auctions
 * @returns Results of the expired auctions processing
 */
export const processExpiredAuctions = async () => {
  console.log('Processing expired auctions...');
  try {
    const results = await fetchFromAPI('/tasks/check-expired-auctions');
    console.log('Expired auctions processing successful:', results);
    return results;
  } catch (error) {
    console.error('Failed to process expired auctions:', error);
    // Return a default structure in case of error to prevent UI from breaking
    return {
      message: 'Failed to process expired auctions',
      auctions_processed: 0,
      auctions_with_winners: 0,
      auctions_without_bids: 0,
      errors: 1,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
