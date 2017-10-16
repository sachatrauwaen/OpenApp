namespace Satrabel.OpenApp.EntityFrameworkCore.Seed.Host
{
    public class InitialHostDbBuilder<TSelf>
        where TSelf : OpenAppDbContext<TSelf>
    {
        private readonly OpenAppDbContext<TSelf> _context;

        public InitialHostDbBuilder(OpenAppDbContext<TSelf> context)
        {
            _context = context;
        }

        public void Create()
        {
            new DefaultEditionCreator<TSelf>(_context).Create();
            new DefaultLanguagesCreator<TSelf>(_context).Create();
            new HostRoleAndUserCreator<TSelf>(_context).Create();
            new DefaultSettingsCreator<TSelf>(_context).Create();

            _context.SaveChanges();
        }
    }
}
