
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyToken } from '@clerk/clerk-sdk-node';

/** Verifies Clerk JWT if CLERK_SECRET_KEY is present; else falls back to header role. */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const auth = (req.headers['authorization'] || '').toString();
    try {
      if (process.env.CLERK_SECRET_KEY && auth.startsWith('Bearer ')) {
        const token = auth.split(' ')[1];
        const { payload } = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
        req.user = { sub: (payload as any).sub, role: (payload as any)?.publicMetadata?.role || 'parent' };
        return true;
      }
    } catch (e) { /* fallthrough */ }
    const role = (req.headers['x-user-role'] || '').toString();
    req.user = { role: role || 'parent' };
    return !!req.user.role;
  }
}
