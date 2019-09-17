using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.IO;
using System.Threading.Tasks;
using OOP5;

namespace OOP8
{
    public class Node<T>
    {
        private Node<T> next;
        private T info;

        public Node<T> NextNode
        {
            get => next;
        }

        public Node<T> SetNextNode(Node<T> _nextNode) => next = _nextNode;

        public T Date
        {
            get => info;
            set => info = value;
        }
    }

    
    class B<T> where T : class
    {
        static T lol;
    }
    class CollectionException : Exception
    {
        public CollectionException(string msg) : base(msg) => Console.WriteLine(msg);
    }

    class CollectionType<T> : Interface<T>
    {

    private Node<T> tail = null;
    private Node<T> head = null;

    public int Lenght { get; private set; }

    public CollectionType()
    {
        if (typeof(T) != typeof(Playground) && typeof(T) != typeof(int) && typeof(T) != typeof(double) && typeof(T) != typeof(string))
        {
            throw new Exception("Type isn't 'Playground', 'Int', 'String', 'Double'");
        }
        head = null;
        tail = null;
        Lenght = 0;
    }

    public Node<T> GetHead => head;

    public void Add(T dt)
    {
        
        if (head == null)
        {
            head = new Node<T>();
            head.Date = dt;
            tail = head;
            head.SetNextNode(null);
        }
        else
        {
            Node<T> tempNode = new Node<T>();
            tempNode.Date = dt;
            tail.SetNextNode(tempNode);
            tail = tempNode;
            tempNode.SetNextNode(null);
        }

        Lenght++;
    }

    public T GetByIndex(int i)
    {
        if (i > Lenght)
        {
            Console.WriteLine($"Lenght is {Lenght}");
            return default(T);
        }

        Node<T> node = head;
        for (int index = 0; index < i; ++index)
        {
            node = node.NextNode;
        }

        return node.Date;

    }

    public void Show()
    {
        Node<T> i = head;
        while (i != null)
        {
            Console.WriteLine(i.Date);
            i = i.NextNode;
        }
    }

    public void Delete(T dt)
    {
        if (head == null)
        {
            Console.WriteLine("List is epmty");
            return;
        }

        Node<T> i = head;
        Node<T> iNext = head.NextNode;
        if (dt.Equals(i.Date))
        {
            head = i.NextNode;
            Console.WriteLine($" {dt} was removing");
            Lenght--;
            return;
        }

        while (iNext != null)
        {
            if (iNext.Date.Equals(dt))
            {
                i.SetNextNode(iNext.NextNode);
                Console.WriteLine($" {dt} was removing");
                Lenght--;
                return;
            }

            i = i.NextNode;
            iNext = iNext.NextNode;
        }

        Console.WriteLine($" {dt} wasn't finding");
    }

    public static CollectionType<T> operator +(CollectionType<T> obj1, CollectionType<T> obj2)
    {
        CollectionType<T> newList = new CollectionType<T>();
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

    public static CollectionType<T> operator +(CollectionType<T> obj1)
    {
        CollectionType<T> listNew = new CollectionType<T>();
        for (int i = 0; i < obj1.Lenght; ++i)
        {
            listNew.Add(obj1.GetByIndex(i));
        }

        return listNew;
    }

    public static CollectionType<T> operator !(CollectionType<T> obj1)
    {
        CollectionType<T> listNew = new CollectionType<T>();
        for (int i = obj1.Lenght - 1; i >= 0; i--)
        {
            listNew.Add(obj1.GetByIndex(i));
        }

        return listNew;
    }

    public static bool operator !=(CollectionType<T> obj1, CollectionType<T> obj2)
    {
        if (obj1.Lenght != obj2.Lenght) return true;
        Node<T> i1 = obj1.GetHead;
        Node<T> i2 = obj2.GetHead;
        while (i1 != null)
        {
            if (i1.Date.Equals(i2.Date)) return true;
            i1 = i1.NextNode;
            i2 = i2.NextNode;
        }

        return false;
    }

    public static bool operator ==(CollectionType<T> obj1, CollectionType<T> obj2)
    {
        if (obj1.Lenght != obj2.Lenght) return false;
        Node<T> i1 = obj1.GetHead;
        Node<T> i2 = obj2.GetHead;
        while (i1 != null)
        {
            if (i1.Date.Equals(i2.Date)) return false;
            i1 = i1.NextNode;
            i2 = i2.NextNode;
        }
        return true;
    }

    public override string ToString() => "CollectionType";

    public void SaveInFile()
    {
        try
        {   
            string writePath = @"D:\Proga\Project\OOP\OOP8\OOP8\file1.txt";
 
            using (StreamWriter sw = new StreamWriter(writePath, false, System.Text.Encoding.Default))
            {
                Node<T> i = GetHead;
                sw.WriteLine($"{DateTime.Now}-----------------------------------------------------------");
                while (i != null)
                {
                    sw.WriteLine(i.Date);
                    i = i.NextNode;
                }
                sw.WriteLine($"By {ToString()}----------------------------------------------------------");

                }

            }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }
    }

    }
}
