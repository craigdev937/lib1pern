import { JwtPayload } from "../models/Interfaces.ts";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}





