using System.Windows.Controls;
using Lab14.Composite;

namespace Lab14.Adapter
{
    public class Master : IComponent
    {
        public string Title { get; set; }

        private readonly TextBlock _box;

        public Master(TextBlock box)
        {
            _box = box;
            Title = "Master";
        }
        public void UseAnimal(IAnimal animal)
        {
            animal.Bark(_box);
        }

        public void Draw(TextBlock box)
        {
            _box.Text += $"{Title} added.\n";
        }

        public IComponent Find(string title)
        {
            return title.Equals(Title) ? this : null;
        }
    }
}
