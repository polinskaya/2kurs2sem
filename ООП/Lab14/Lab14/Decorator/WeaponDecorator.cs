using System.Windows.Media;//extantion of current obj

namespace Lab14.Decorator
{
    public abstract class WeaponDecorator : Weapon
    {
        protected Weapon Weapon;
        public WeaponDecorator(string name, Weapon weapon) : base(name) //\\
        {
            Weapon = weapon;
        }
    }
}
