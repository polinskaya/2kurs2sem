using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOP5
{
    sealed class Tennis :  Playground, ITennisBall
    {

        public void PumpUp()
        {
            Console.WriteLine("You can't pump up tennis ball");
        }

        public void Play()
        {
             Console.WriteLine("You played in tennis");
        }

        public void Throw()
        {
            Console.WriteLine("You threw a tennis ball");
        }

        public void TakeFromInventory()
        {
            Console.WriteLine("You took things with tennis inventory");
        }

        public void PutInInventory()
        {
          Console.WriteLine("You put things in tennis inventory");
        }

        public override string ToString() => "PlaygroundITennisBallTennis";

        public override bool Equals(object obj)
        {
            if (obj.GetType() != GetType()) return false;

            Tennis other = (Tennis)obj;
            return (Exp == other.Exp);
        }

        // Return the XOR of the x and y fields.
        public override int GetHashCode()
        {
            return DateTime.Now.Millisecond;
        }


        public override void DoExercise() => Console.WriteLine("You do exersise on tenniscarea (abstract)", Exp +=10);
        void ITennisBall.DoExercise() => Console.WriteLine("You do exersise on tenniscarea (interface)", Exp += 10);

    }

    sealed class Basketball: Playground, IBacketBall
    {
        public override string ToString() => "PlaygroundIBasketBallTennis";

        public void PumpUp()
        {
            Console.WriteLine("You pumped up basketball");
        }

        public void Play()
        {
            Console.WriteLine("You played in basketball");
        }

        public void Throw()
        {
            Console.WriteLine("You threw a basket ball");
        }

        public void TakeFromInventory()
        {
            Console.WriteLine("You took things with basketball inventory");
        }

        public void PutInInventory()
        {
            Console.WriteLine("You put things in basketball inventory");
        }
        
        public override void DoExercise() => Console.WriteLine("You do exersise on basketballarea", Exp += 15);
    }


    abstract class Playground
    {
        protected int Exp = 0;

        public override string ToString() => "Playground";

        public Playground() {}

        public int GetExp() => Exp;
        public virtual void Ralax(int hour) => Console.WriteLine($"Relax will be {hour} hour/s", Exp+= hour/10);
        public abstract void DoExercise();
    }

    class Beams : Playground
    {
        public override string ToString() => "PlaygroundBeams";

        public Beams(int num)
        {
            NumPullUpPerDay = num;
        }

        private int NumPullUpPerDay;

        public override void DoExercise()
        {
            Exp += NumPullUpPerDay / 2;

            if (Exp % 10 > 5)
            {
                NumPullUpPerDay += 3;
            }

            Console.WriteLine("You do exersise on Beams");
        }
    }

    sealed class Bench: Playground
    {
        public override string ToString() => "PlaygroundBench";

        public override void DoExercise() => Console.WriteLine("You can't do exersise on Bench");
    }

    //class NewBench: Bench
    //{
    //}

    class Mats : Playground
    {
        public override string ToString() => "PlaygroundMats";

        public override void DoExercise() => Console.WriteLine("You do exersise on Mat",Exp += 1);
    }

    class HorizontalBar : Playground
    {

        public override string ToString() => "PlaygroundHorizontalBar";

        public HorizontalBar(int num)
        {
            NumPullUpPerDay = num;
        }

        private int NumPullUpPerDay;

        public override void DoExercise()
        {
            Exp += NumPullUpPerDay / 2;
            if (Exp % 10 > 5)
            {
                NumPullUpPerDay += 3;
            }
            Console.WriteLine("You do exersise on HorisontalBar");
        }
    }

    class Printer
    {
        public void iAmPrinting(Playground someobj)
        {
            Console.WriteLine(someobj.ToString());
        }
    }

}
