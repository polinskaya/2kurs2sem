using System.Windows.Controls;
using Lab14.Decorator;

namespace Lab14.Adapter
{
    public class TankToAnimalAdapter : IAnimal
    {
        private readonly Tank _tank;
        private readonly RedTank _redTank;

        public TankToAnimalAdapter(Tank tank)
        {
            _tank = tank;
        }

        public TankToAnimalAdapter(RedTank redTank)
        {
            _redTank = redTank;
        }
        public void Bark(TextBlock box)
        {
            _tank?.Attack(box);
            _redTank?.Attack(box);
        }
    }
}
