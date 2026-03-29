import forgotPasswordTemplate from '../emails/emailTemplates/forgotPasswordTemplate';
import hubEmergencyInviteTemplate from '../emails/emailTemplates/hubEmergencyInviteTemplate';

export default function emailMessage(type: string, link: string) {
  return type === 'invite'
    ? hubEmergencyInviteTemplate(link)
    : forgotPasswordTemplate(link);
}
