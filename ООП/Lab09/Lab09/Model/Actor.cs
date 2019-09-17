using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lab09.Model
{
    public class Actor
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public virtual User User { get; set; }
    }
}
