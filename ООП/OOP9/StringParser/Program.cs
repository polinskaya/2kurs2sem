using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StringParser
{
    class Program
    {
        static void Main(string[] args)
        {
            Func<string, string> parseStr = s =>
            {
                string newS = "";
                for (int i = 0; i < s.Length; ++i)
                {
                    if (s[i] != '.' && s[i] != ',' && s[i] != '!' && s[i] != '-' && s[i] != '?' )
                        newS += s[i];
                }

                return newS;
            };
            Console.WriteLine(parseStr("qwd! dsfdd, dssdsd, dsw3. WKkdnksd!!!!!dkskds.....??????выдыь."));

            Func<string, string> delSpace = s =>
            {
                string newS = "";
                for (int i = 0; i < s.Length; ++i)
                {
                    if (s[i] == ' ' && i + 1 != s.Length && s[i + 1] == ' ')
                    {

                    }
                    else
                    {
                        newS += s[i];
                    }
                }
                return newS;
            };
            Console.WriteLine(delSpace("dskfkds            dsajsdjk kdskndsl   skls   sklnsd   sklk ns ls s  slkns   smslds    sdkl"));

            Action<string, string> oper1 = Met1;
            oper1("111111111", "222222222");
            Action<string, string, int> oper2 = Met2;
            oper2("1111111111", "33333333", 4);
            Action<string, int > oper3 = Met3;
            oper3("11112222", 4);


            Console.ReadLine();
        }

        static void Met1(string a, string b)
        {
            Console.WriteLine(a+b);
        }

        static void Met2(string a, string b, int index)
        {
            string newStr = "";
            if (a.Length < index) throw new Exception("Error: a.Length < index ");
            for (int i = 0; i < index; i++)
            {
                newStr += a[i];
            }

            for (int j = 0; j < b.Length; j++)
            {
                newStr += b[j];
            }

            for (int i = index; i < a.Length; i++)
            {
                newStr += a[i];
            }

            Console.WriteLine(newStr);
        }

        static void Met3(string a, int index)
        {
            string newStr = ""; 
            if(a.Length < index) throw new Exception("Error: a.Length < index ");
            for (int i = index; i < a.Length; i++)
            {
                newStr += a[i];
            }

            Console.WriteLine(newStr);
        }
    }
}
