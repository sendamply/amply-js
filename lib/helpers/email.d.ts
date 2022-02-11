export = EmailHelper;
declare class EmailHelper {
    static formatEmails(emails: any): {
        email: string;
    }[];
    requestData: {};
    parsedData(data: any): {};
    setTo(to: any): void;
    setCc(cc: any): void;
    setBcc(bcc: any): void;
    setFrom(from: any): void;
    setSubject(subject: any): void;
    setText(text: any): void;
    setHtml(html: any): void;
    setReplyTo(replyTo: any): void;
    setContent(content: any): void;
    setTemplate(template: any): void;
    setDynamicTemplateData(dynamicTemplateData: any): void;
    setUnsubscribeGroupUuid(unsubscribeGroupUuid: any): void;
    setIpOrPoolUuid(ipOrPoolUuid: any): void;
    setAttachments(attachments: any): void;
    setHeaders(headers: any): void;
    setCategories(categories: any): void;
    setClicktracking(clicktracking: any): void;
    setSubstitutions(substitutions: any): void;
    setSendAt(sendAt: any): void;
    setPersonalizations(personalizations: any): void;
    setPersonalizationsFromTo(to: any, cc: any, bcc: any): void;
}
