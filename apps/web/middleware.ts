
import { authMiddleware } from '@clerk/nextjs';
export default authMiddleware({ publicRoutes: ['/', '/catalog', '/api/(.*)'] });
export const config = { matcher: ['/((?!_next|static|.*\..*).*)'] };
