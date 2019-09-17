using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OOP8;

namespace OOP4
{
   

    public class Node
    {
        private Node next;
        private string info;

        public Node NextNode
        {
            get => next;
        }

        public Node SetNextNode(Node _nextNode) => next = _nextNode;

        public string Date
        {
            get => info;
            set => info = value;
        }
    }

    public class List
    {
        public class Owner
        {
            public Owner(string Name, string Organ)
            {
                Id++;
                name = Name;
                organ = Organ;
            }

            public void ShowInfo() => Console.WriteLine($" Id: {Id}\n Name: {name}\n Organization: {organ}");

            private static int Id = 0;
            private string name;
            private string organ;
        }

        public class Date
        {
            public Date()
            {
                time = DateTime.Now;
            }
            private DateTime time;
            public void ShowDate() => Console.WriteLine(time);
        }

        private Node tail = null;
        private Node head = null;

        public Owner _owner { get; set; }

        public Date _date { get; set; }

        public int Lenght { get;private set; }

        public List()
        {
            head = null;
            tail = null;
            Lenght = 0;
        }

        public Node GetHead => head;
        public void Add(string _date)
        {
            if (head == null)
            {
                head = new Node();
                head.Date = _date;
                tail = head;
                head.SetNextNode(null);
            }
            else
            {
                Node tempNode = new Node();
                tempNode.Date = _date;
                tail.SetNextNode(tempNode);
                tail = tempNode;
                tempNode.SetNextNode(null);
            }
            Lenght++;
        }

        public string GetByIndex(int i)
        {
            if (i > Lenght)
            {
                Console.WriteLine($"Lenght is {Lenght}");
                return null;
            }

            Node node = head;
            for (int index = 0; index < i; ++index)
            {
                node = node.NextNode;
            }
            return node.Date;
        
        }

        public void Show()
        {
            Node i = head;
            while (i != null)
            {
                Console.WriteLine(i.Date);
                i = i.NextNode;
            }
        }

        public void Remove(string _date)
        {
            if (head == null)
            {
                Console.WriteLine("List is epmty");
                return;
            }
            Node i = head;
            Node iNext = head.NextNode;
            if (i.Date == _date)
            {
                head = i.NextNode;
                Console.WriteLine($" {_date} was removing");
                Lenght--;
                return;
            }
            while (iNext != null)
            {
                if (iNext.Date == _date)
                {
                    i.SetNextNode(iNext.NextNode);
                    Console.WriteLine($" {_date} was removing");
                    Lenght--;
                    return;
                }
                i = i.NextNode;
                iNext = iNext.NextNode;
            }
            Console.WriteLine($" {_date} wasn't finding");
        }

        public static List operator +(List obj1, List obj2)
        {
            List newList = new List();
            for (int i = 0; i < obj1.Lenght; ++i)
            {
                newList.Add(obj1.GetByIndex(i));
            }
            for (int i = 0; i < obj2.Lenght; ++i)
            {
                newList.Add(obj2.GetByIndex(i));
            }

            return newList;
        }

        public static List operator +(List obj1)
        {
            List listNew = new List();
            for (int i = 0; i < obj1.Lenght; ++i)
            {
               listNew.Add(obj1.GetByIndex(i));
            }
            return listNew;
        }

        public static List operator !(List obj1)
        {
            List listNew = new List();
            for (int i = obj1.Lenght - 1; i >= 0; i--)
            {
                listNew.Add(obj1.GetByIndex(i));
            }
            return listNew;
        }

        public static bool operator !=(List obj1, List obj2)
        {
            if (obj1.Lenght != obj2.Lenght) return true;
            Node i1 = obj1.GetHead;
            Node i2 = obj2.GetHead;
            while (i1 != null)
            {
                if (i1.Date != i2.Date) return true;
                i1 = i1.NextNode;
                i2 = i2.NextNode;
            }

            return false;
        }

        public static bool operator ==(List obj1, List obj2)
        {
            if (obj1.Lenght != obj2.Lenght) return false;
            Node i1 = obj1.GetHead;
            Node i2 = obj2.GetHead;
            while (i1 != null)
            {
                if (i1.Date != i2.Date) return false;
                i1 = i1.NextNode;
                i2 = i2.NextNode;
            }

            return true;
        }

    }

    public static class ListExtension
    {
        public static string SumList(this List obj)
        {
            string retStr = "";
            Node i = obj.GetHead;
            while (i != null)
            {
                retStr += i.Date + " ";
                i = i.NextNode;
            }
            return retStr;
        }

        public static void СropList(this List obj, int _size)
        {
            Node i = obj.GetHead;
            while (i != null)
            {
                i.Date = i.Date.Substring(0, _size);
                i = i.NextNode;
            }
        }

        public static string[] MaxString(this List obj)
        {
            string[] arrStr = new string[1];

            int maxStrInObj = 0;
            Node i = obj.GetHead;
            while (i != null)
            {
                if (i.Date.Length > maxStrInObj)
                    maxStrInObj = i.Date.Length;
                i = i.NextNode;
            }

            i = obj.GetHead;

            while (i != null)
            {
                if (i.Date.Length == maxStrInObj)
                {
                    if (arrStr[0] == null)
                    {
                        arrStr[0] = i.Date;
                    }
                    else
                    {
                        int ArrSize = arrStr.Length;
                        string [] tempArr = new string[ArrSize];
                        for (int j = 0; j < ArrSize; ++j)
                            tempArr[j] = arrStr[j];
                        arrStr = new string[ArrSize+1];
                        for (int j = 0; j < ArrSize; ++j)
                            arrStr[j] = tempArr[j];
                        arrStr[ArrSize] = i.Date;
                    }
                }
                i = i.NextNode;
            }
            Console.WriteLine("Max length string");
            foreach (var str in arrStr)
            {
                Console.WriteLine(str);
            }
            return arrStr;
        }
    }

}
