using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using OOP5;


namespace OOP8
{
    class Program
    {
        class MyClass
        {
            
        }

        static void Main(string[] args)
        {
            try
            {
                CollectionType<int> obj1 = new CollectionType<int>();
                CollectionType<int> obj2 = new CollectionType<int>();
                //CollectionType<MyClass> objType = new CollectionType<MyClass>(); eeeeeeerrrrrrrrrrrrroooooooorrrrrrrrrrrr
                CollectionType<Playground> plGr = new CollectionType<Playground>();
                Playground hb = new HorizontalBar(12);
                Interface<int> a;
                plGr.Add(new Basketball());
                plGr.Add(new Basketball());
                plGr.Add(hb);
                plGr.Add(new Bench());
                plGr.Add(new Tennis());
                plGr.Show();
                plGr.Delete(hb);
                plGr.GetByIndex(2);
                plGr.Show();
                obj1.Add(2);
                obj1.Add(3);
                obj1.Add(4);
                a = obj1;
                a.Show();
                obj2.Add(5);
                obj2.Add(6);

                obj1.Show();

                obj1.SaveInFile();
                plGr.SaveInFile();
                //////////////////////////////////////////////////////////////////////////
                CollectionType<Playground> plGr2 = new CollectionType<Playground>();
                LoadFromFile(ref plGr2);
                plGr2.Show();
            }
            catch (CollectionException e)
            {
                Console.WriteLine(e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                Console.WriteLine("FINALLY");
            }
            Console.ReadLine();
        }
        public static void LoadFromFile(ref CollectionType<Playground> objCollectionType)
        {
            try
            {
                string text = "";
                int num;
                string readPath = @"D:\Proga\Project\OOP\OOP8\OOP8\file2.txt";

                using (StreamReader sr = new StreamReader(readPath, System.Text.Encoding.Default))
                {
                    while (sr.ReadLine() != null)
                    {
                        text = sr.ReadLine();
                        switch (text)
                        {
                            case "Beams":
                                num = int.Parse(sr.ReadLine());
                                objCollectionType.Add(new Beams(num));
                                break;
                            case "HorizontalBar":
                                num = int.Parse(sr.ReadLine());
                                objCollectionType.Add(new HorizontalBar(num));
                                break;
                            case "Mats":
                                objCollectionType.Add(new Mats());
                                break;
                            case "Tennis":
                                objCollectionType.Add(new Tennis());
                                break;
                            case "Bench":
                                objCollectionType.Add(new Bench());
                                break;
                            case "Basketball":
                                objCollectionType.Add(new Basketball());
                                break;
                            default: throw new Exception($"No right type: {text}");
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }

}
