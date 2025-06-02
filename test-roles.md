# Role-Based Functionality Testing

## Testing Admin Users

1. **Login as Admin**
   - Username: admin1@mail.com 
   - Password: adminpass
   
2. **Verify Profile Page (Admin Dashboard)**
   - Navigate to Profile page
   - Confirm admin dashboard appears with:
     - Statistics cards (Total Auctions, Active Auctions, Total Revenue, Total Bids)
     - Recent Auctions list
     - Active Auctions with Bids list
     - Recent Bid Activity section

3. **Verify Auction Details Page (Admin View)**
   - Navigate to any auction details page
   - Confirm admin controls panel appears
   - Verify the bidding section is hidden
   - Verify the admin message "As an admin, you cannot place bids on auctions" is displayed
   - Test admin controls to update auction status

## Testing Regular Users

1. **Login as Regular User**
   - Username: reivel@mail.com
   - Password: pass123

2. **Verify Profile Page (User Dashboard)**
   - Navigate to Profile page
   - Confirm user dashboard appears with:
     - "Auctions I Participated In" section
     - "Auctions I Won" section

3. **Verify Auction Details Page (User View)**
   - Navigate to any auction details page
   - Confirm admin controls panel is hidden
   - Verify the bidding section is displayed
   - Test placing a bid using the quick bid buttons

## Role-Based Access Control Summary

| Feature                  | Admin | Regular User |
|--------------------------|-------|-------------|
| View Admin Dashboard     | ✅    | ❌         |
| View User Dashboard      | ❌    | ✅         |
| Admin Controls on Auctions | ✅  | ❌         |
| Place Bids               | ❌    | ✅         |
| View Auction Details     | ✅    | ✅         |
