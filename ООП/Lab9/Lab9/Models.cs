﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lab9
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public override string ToString()
        {
            return $"{Id} - {Name}";
        }
    }

    public class Phone
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }

        public int CompanyId { get; set; }
        public Company Company { get; set; }

        public override string ToString()
        {
            return $"{Name} - {Price}$";
        }
    }
}
