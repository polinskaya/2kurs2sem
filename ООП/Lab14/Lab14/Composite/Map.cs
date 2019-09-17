using System.Collections.Generic;//работать как одно целое с группой объектов
using System.Windows.Controls;

namespace Lab14.Composite
{
    public class Map : IComponent
    {
        public string Title { get; set; }

        private readonly List<IComponent> _map;

        public Map()
        {
            _map = new List<IComponent>();
        }
        public void Draw(TextBlock box)
        {
            foreach (var component in _map)
            {
                component.Draw(box);
            }
            box.Text += "\n";
        }

        public IComponent Find(string title)
        {
            return _map.Find(c => c.Title.Equals(title));
        }

        public void AddComponent(IComponent component)
        {
            _map.Add(component);
        }
    }
}
