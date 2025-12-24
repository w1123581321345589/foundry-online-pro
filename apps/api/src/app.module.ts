import { Module } from '@nestjs/common';
import { HealthController } from './routes/health.controller';
import { ClassesController } from './routes/classes.controller';
import { LearnStudioController } from './routes/learn-studio.controller';
import { SafetyController } from './routes/safety.controller';
import { PaymentsController } from './routes/payments.controller';
import { EsaController } from './routes/esa.controller';
import { RecapController } from './routes/recap.controller';
import { StripeConnectController } from './routes/stripe-connect.controller';
import { StripeConnectReportingController } from './routes/stripe-connect-reporting.controller';
import { OperatorOnboardController } from './routes/operator.controller';
import { AttendanceController } from './routes/attendance.controller';
import { SessionsController } from './routes/sessions.controller';
import { PortalController } from './routes/portal.controller';

@Module({
  imports: [],
  controllers: [
    HealthController,
    ClassesController,
    LearnStudioController,
    SafetyController,
    PaymentsController,
    EsaController,
    RecapController,
    StripeConnectController,
    StripeConnectReportingController,
    OperatorOnboardController,
    AttendanceController,
    SessionsController,
    PortalController,
  ],
  providers: [],
})
export class AppModule {}
