import { checkDataIntegrity, fixDataIntegrity } from '../utils/database_integrity';

// Check data integrity
export const checkDatabaseIntegrity = async (req: any, res: any) => {
    try {
        // Only allow admin to perform this action
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can perform this action' });
        }
        
        const results = await checkDataIntegrity();
        res.status(200).json({
            message: 'Database integrity check completed',
            results
        });
    } catch (error) {
        console.error('Error checking database integrity:', error);
        res.status(500).json({ message: 'Error checking database integrity', error });
    }
};

// Fix data integrity issues
export const fixDatabaseIntegrity = async (req: any, res: any) => {
    try {
        // Only allow admin to perform this action
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can perform this action' });
        }
        
        const results = await fixDataIntegrity();
        res.status(200).json({
            message: 'Database integrity issues fixed',
            results
        });
    } catch (error) {
        console.error('Error fixing database integrity:', error);
        res.status(500).json({ message: 'Error fixing database integrity', error });
    }
};
