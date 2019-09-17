using Lab14.Adapter;//динамическая альтернатива наследования (позволяет динамически подключать к объекту дополнительную функциональность)
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;

namespace Lab14.Decorator
{
    public class RedDog : WeaponDecorator, IAnimal
    {
        public RedDog(string name, Weapon weapon) : base(name, weapon)
        {
        }

        public override Brush GetColor()
        {
            return Brushes.Red;
        }

        public void Bark(TextBlock box)
        {
            var run = new Run($"{Name} barking\n") {Foreground = GetColor()};
            box.Inlines.Add(run);
        }
    }
}
