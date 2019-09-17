using Lab14.Adapter;
using Lab14.Decorator;
using System.Windows;
using Lab14.Composite;

namespace Lab14
{
    public partial class MainWindow
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void ShowWork(object sender, RoutedEventArgs e)
        {
            var master = new Master(ExampleBlock);
            var dog = new Dog("Black Dog");
            var tank = new Tank("Black Tank");
            var map = CreateMap(master, dog, tank);
            UseBlackItems(master, dog, tank);
            UseRedItems(master, dog, tank);
        }

        private void UseBlackItems(Master master, IAnimal dog, Tank tank)
        {
            master.UseAnimal(dog);
            IAnimal animal = new TankToAnimalAdapter(tank);
            master.UseAnimal(animal);
        }

        private void UseRedItems(Master master, Weapon dog, Weapon tank)
        {
            var redDog = new RedDog("Red Dog", dog);
            master.UseAnimal(redDog);
            var redTank = new RedTank("Red Tank", tank);
            IAnimal redAnimal = new TankToAnimalAdapter(redTank);
            master.UseAnimal(redAnimal);
        }

        private Map CreateMap(params IComponent[] components)
        {
            var map = new Map();
            foreach (var component in components)
            {
                map.AddComponent(component);
            }
            ShowMap(map);
            return map;
        }

        private void ShowMap(Map map)
        {
            map.Draw(ExampleBlock);
        }
    }
}
