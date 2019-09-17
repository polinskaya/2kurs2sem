using System.Collections.Generic;

namespace Lab09.Model
{
    public class User
    {
        public User() { this.Actors = new List<Actor>(); }
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Actor> Actors { get; set; }
        public override string ToString()
        {
            return Name;
        }
    }
}
