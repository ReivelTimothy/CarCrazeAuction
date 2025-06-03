/**
 * Utility functions for admin operations
 */

/**
 * Format database integrity check results for display
 */
export const formatIntegrityResults = (results: any) => {
  const totalIssuesFound = 
    (results.results?.transactions?.missingUser || 0) + 
    (results.results?.transactions?.missingAuction || 0) +
    (results.results?.bids?.missingUser || 0) +
    (results.results?.bids?.missingAuction || 0) +
    (results.results?.auctions?.missingVehicle || 0);
        
  // Create a more structured results display
  const resultMessage = totalIssuesFound > 0 
    ? `⚠️ Found ${totalIssuesFound} integrity issues that need attention`
    : `✅ No integrity issues found - database is healthy`;
    
  return (
    `Database Integrity Check Results\n` +
    `=================================\n\n` +
    `${resultMessage}\n\n` +
    `SUMMARY:\n` +
    `• Transactions checked: ${results.results?.transactions?.total || 0}\n` +
    `  - Missing user references: ${results.results?.transactions?.missingUser || 0}\n` +
    `  - Missing auction references: ${results.results?.transactions?.missingAuction || 0}\n\n` +
    `• Bids checked: ${results.results?.bids?.total || 0}\n` +
    `  - Missing user references: ${results.results?.bids?.missingUser || 0}\n` +
    `  - Missing auction references: ${results.results?.bids?.missingAuction || 0}\n\n` +
    `• Auctions checked: ${results.results?.auctions?.total || 0}\n` +
    `  - Missing vehicle references: ${results.results?.auctions?.missingVehicle || 0}\n\n` +
    (totalIssuesFound > 0 
      ? `Click "Fix Integrity Issues" to resolve these inconsistencies.` 
      : `Your database is in excellent condition!`)
  );
};

/**
 * Format database integrity fix results for display
 */
export const formatIntegrityFixResults = (results: any) => {
  const totalFixed = 
    (results.results?.transactions || 0) + 
    (results.results?.bids || 0) + 
    (results.results?.auctions || 0);
    
  const resultMessage = totalFixed > 0 
    ? `✅ Successfully fixed ${totalFixed} integrity issues` 
    : `ℹ️ No issues needed to be fixed`;
    
  return (
    `Database Repair Results\n` +
    `======================\n\n` +
    `${resultMessage}\n\n` +
    `DETAILS:\n` +
    `• Transactions fixed: ${results.results?.transactions || 0}\n` +
    `• Bids fixed: ${results.results?.bids || 0}\n` +
    `• Auctions fixed: ${results.results?.auctions || 0}\n\n` +
    `The database is now in a consistent state.`
  );
};

/**
 * Format expired auctions processing results for display
 */
export const formatExpiredAuctionsResults = (results: any) => {
  const processedCount = results.auctions_processed || 0;
  const resultMessage = processedCount > 0 
    ? `✅ Successfully processed ${processedCount} expired auctions` 
    : `ℹ️ No expired auctions needed processing`;
    
  return (
    `Expired Auctions Processing\n` +
    `==========================\n\n` +
    `${resultMessage}\n\n` +
    `RESULTS:\n` +
    `• Total auctions processed: ${results.auctions_processed || 0}\n` +
    `• Auctions with winners: ${results.auctions_with_winners || 0}\n` +
    `• Auctions without bids: ${results.auctions_without_bids || 0}\n` +
    `• Processing errors: ${results.errors || 0}\n\n` +
    (results.errors > 0 
      ? `⚠️ There were some errors processing auctions. Check the console for details.` 
      : `All auctions were processed successfully!`)
  );
};