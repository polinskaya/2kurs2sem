using System.Windows.Controls; // суть - использовать вместе классы с несовместимым интерфейсом
using System.Windows.Media;
using Lab14.Composite;
using Lab14.Decorator;

namespace Lab14.Adapter
{
    public class Dog : Weapon, IAnimal, IComponent
    {
        public string Title { get; set; }
        public void Bark(TextBlock box)
        {
            box.Text += $"{Name} barking.\n";
        }

        public Dog(string name) : base(name)
        {
            Title = name;
        }

        public override Brush GetColor()
        {
            return Brushes.Black;
        }

        public void Draw(TextBlock box)
        {
            box.Text += $"{Title} added.\n";
        }

        public IComponent Find(string title)
        {
            return title.Equals(Title) ? this : null;
        }
    }
}
