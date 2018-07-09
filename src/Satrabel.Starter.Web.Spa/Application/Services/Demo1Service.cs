using Abp;
using Abp.Localization;
using Abp.Notifications;

namespace Satrabel.Starter.Web.Application
{
    public class Demo1Service : MyApplicationServiceBase
    {
        private readonly INotificationPublisher _notiticationPublisher;

        public Demo1Service(INotificationPublisher notiticationPublisher)
        {
            _notiticationPublisher = notiticationPublisher;
        }

        public string GetMyGreeting()
        {
            return "Demo1Service salutes you!";
        }


        public void SendNotification(string message)
        {
            //Example "LowDiskWarningMessage" content for English -> "Attention! Only {remainingDiskInMb} MBs left on the disk!"
            //var data = new LocalizableMessageNotificationData(new LocalizableString("LowDiskWarningMessage", "MyLocalizationSourceName"));
            //data["remainingDiskInMb"] = remainingDiskInMb;

            var defaultTenantAdmin = new UserIdentifier(1, 2);
            var hostAdmin = new UserIdentifier(null, 1);

            _notiticationPublisher.Publish(
                "App.SimpleMessage",
                new MessageNotificationData(message),
                severity: NotificationSeverity.Info,
                userIds: new[] { defaultTenantAdmin, hostAdmin }
            );
        }

    }
}