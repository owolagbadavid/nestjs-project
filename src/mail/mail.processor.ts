import {
  //   OnGlobalQueueActive,
  OnGlobalQueueCompleted,
  OnGlobalQueueError,
  OnGlobalQueueFailed,
  OnGlobalQueueProgress,
  OnQueueActive,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { MailService } from './mail.service';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  private readonly logger = new Logger(MailProcessor.name);

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data...`,
    );
  }

  @OnGlobalQueueCompleted()
  onCompleted(jobId: number) {
    this.logger.debug(`Completed job ${jobId} of type ${''} with result ${''}`);
  }

  @OnGlobalQueueProgress()
  onProgress(jobId: number) {
    this.logger.debug(`Progress job ${jobId} of type ${''} with data...`);
  }

  // on failed
  @OnGlobalQueueError()
  onError(jobId: number, error: any) {
    this.logger.error(
      `Failed job ${jobId} of type ${''} with error ${error.message}`,
    );
  }

  @OnGlobalQueueFailed()
  onfailed(jobId: number, error: any) {
    this.logger.error(
      `Failed job ${jobId} of type ${''} with error ${error.message}`,
    );
  }

  @Process('send-sup-mail')
  async sendMail(job: Job) {
    this.logger.debug('Start sending mail to supervisor');
    this.logger.debug(job.data.staffName);

    this.logger.debug(job.data.supervisor.email);

    try {
      //   await this.mailService.sendSupervisorToken(
      //     job.data.supervisor,
      //     job.data.staffName,
      //     job.data.form,
      //     job.data.formType,
      //     job.data.origin,
      //   );
    } catch (error) {
      this.logger.error(error);
    }

    await job.progress(100);
    this.logger.debug('Finished sending mail to supervisor');
  }
}
