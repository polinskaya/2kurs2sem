using System.Windows.Media;

namespace Lab14.Decorator
{
    public abstract class Weapon
    {
        public string Name { get; protected set; }
        public Weapon(string name)
        {
            Name = name;
        }

        public abstract Brush GetColor();
    }
}
