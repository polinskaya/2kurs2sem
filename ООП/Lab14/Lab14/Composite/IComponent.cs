using System.Windows.Controls;

namespace Lab14.Composite
{
    public interface IComponent
    {
        string Title { get; set; }
        void Draw(TextBlock box);
        IComponent Find(string title);
    }
}
