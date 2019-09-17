using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;
using Lab14.Adapter;

namespace Lab14.Decorator
{
    public class RedTank : WeaponDecorator, IWarmachine
    {
        public RedTank(string name, Weapon weapon) : base(name, weapon)
        {
        }

        public override Brush GetColor()
        {
            return Brushes.Red;
        }

        public void Attack(TextBlock box)
        {
            var run = new Run($"{Name} attack.\n") {Foreground = GetColor()};
            box.Inlines.Add(run);
        }
    }
}
