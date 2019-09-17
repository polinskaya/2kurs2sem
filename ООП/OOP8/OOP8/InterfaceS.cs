using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOP5
{
    public interface IBall : Iinventory
    {
        void Throw();
        void PumpUp();
        void Play();
    }

    public interface ITennisBall : IBall
    {
        new void Play();
        void DoExercise();
    }

    public interface IBacketBall : IBall
    {
        new void Play();
    }

    public interface IExersise
    {
        int GetExp();
        void DoExercise(int hour);
    }

    public interface ISportGame
    {
        void Play(int hour);
    }

    public interface Iinventory
    {
        void TakeFromInventory();
        void PutInInventory();
    }

    // playground  - inventar ------ mjac
    //      |      - skamejka     -- bask mjac   
    //      |      - brusja
    //      |      - maty 
    //      |---plosadki-------------------tenisn plosadka -- tenis      
}       //                                    -bask plasadka   -- bask 
