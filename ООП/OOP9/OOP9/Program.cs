using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace OOP9
{
    class User
    {
        public override string ToString() => UserName;
        
        private string UserName; 
        public delegate void SoftwareState(string msg);
        public event SoftwareState Upgrade;
        public event SoftwareState Work; // 

        public User(string name)
        {
            UserName = name;
        }

        public void Working(string msg, Software obj)
        {
            
            obj.SoftThread = new Thread(() =>
            {
                for (int i = 0; i < 30; i++)
                {
                    lock (new object())
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine($"Program {obj.Name} version {obj.Version}.0 is working");
                        Console.ForegroundColor = ConsoleColor.Cyan;
                        Work(msg);
                        Thread.Sleep(2000);
                    }
                }
                //Work = null; .............
            });
            obj.SoftThread.Start();
        }

        public void Updating(byte ver, string msg, Software obj)
        {
            if (Work == null || obj.SoftThread == null )
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($" Program {obj.Name} is not run!!!");
                Console.Beep(600, 1000);
                return;
            }
            if (ver != obj.Version)
            {
                obj.Version = ver;
                obj.SoftThread.Abort();
                obj.SoftThread = new Thread(() =>
                {
                    for (int i = 0; i <= 100; i++)
                    {
                        lock (new object())
                        {
                            Console.Beep(350, 250);
                            Console.ForegroundColor = ConsoleColor.Yellow;
                            Console.WriteLine($"Program {obj.Name} version {obj.Version}.0 is updating {i}%");
                            Console.ForegroundColor = ConsoleColor.DarkCyan;
                            Upgrade(msg);
                            Thread.Sleep(1000);
                        }
                    }
                });
                obj.SoftThread.Start();
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"!!!Update isn't available because version is {obj.Version}.0");
                Console.Beep(600, 420);
                Console.Beep();
            }
        }

    }

    class Software
    {
        public Thread SoftThread;

        public Software(byte ver, string name)
        {
            Version = ver;
            this.name = name;
        }

        private string name;

        public byte Version { get; set; }

        public string Name
        {
            get => name;
            set => name = value;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            User user1 = new User("topPragramist");

            Software sw1 = new Software(1, "QQQQQQ");
            Software sw2 = new Software(3, "DDDDD");
            Software sw3 = new Software(10, "CCCCCC");
            Software sw4 = new Software(11, "BBBBB");
            Software sw5 = new Software(4, "AAAAA");

            user1.Work += msg => Console.WriteLine("----------------------------------------COMPLETE-----------------------------------");
            user1.Updating(12,"11111111111111111", sw1);

            user1.Upgrade += (softwareMsg) =>
            {
                Console.BackgroundColor = ConsoleColor.Red;
                Console.WriteLine($"UPDATE---------------------------");
                Console.BackgroundColor = ConsoleColor.Black;
            };

            user1.Upgrade += (softwareMsg) =>
            {
                Console.BackgroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"User {user1} is updating program : {softwareMsg}");
                Console.BackgroundColor = ConsoleColor.Black;
            };
            

            user1.Working("11111111111", sw1);
            Thread.Sleep(100);
            user1.Working("222222222222", sw2);
            Thread.Sleep(100);
            user1.Working("3333333333333", sw3);
            Thread.Sleep(100);
            user1.Working("444444444444", sw4);
            Thread.Sleep(6000);
            user1.Updating(15, "sw3 is updating", sw3);
            user1.Working("55555555555555", sw5);
            user1.Updating(4, "EEE update", sw5);

            // callback
            voidDelegate a = null;
            a?.Invoke(12);
            //Console.WriteLine(cb(10, (i)=>i*i));
            Console.ReadLine();
        }
        delegate void voidDelegate(int a);
        static int cb(int i, Func<int,int> funcb) => funcb(i);


    }
}
