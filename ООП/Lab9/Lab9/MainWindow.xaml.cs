using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Lab9
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private EFGenericRepository<Phone> phoneRepo;
        private EFGenericRepository<Company> companyRepo;
        private UnitOfWork unitOfWork;

        public MainWindow()
        {
            InitializeComponent();
            //rep
            phoneRepo = new EFGenericRepository<Phone>(new ApplicationContext());
            companyRepo = new EFGenericRepository<Company>(new ApplicationContext());
            phone.ItemsSource = phoneRepo.Get();
            company.ItemsSource = companyRepo.Get();
            //unit
            unitOfWork = new UnitOfWork(new ApplicationContext());
            company_Unit.ItemsSource = unitOfWork.CompanyRepository.Entities.ToList();
            phone_Unit.ItemsSource = unitOfWork.PhoneRepository.Entities.ToList();
        }


        private void Button_Click(object sender, RoutedEventArgs e)
        {
            if(company.SelectedIndex != -1)
            {

                decimal qwe = decimal.Parse(priceTB.Text);
                Company qwe2 = company.SelectedItem as Company;


                phoneRepo.Create(new Phone
                {
                    Company =qwe2 ,
                    Name = phoneTB.Text,
                    Price = qwe,
                });
            }
            phone.ItemsSource = phoneRepo.Get();//GetWithInclude(x => x.Company.Name, p => p.Company);
            this.UpdateLayout();
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            companyRepo.Create(new Company
            {
                Name = companyTB.Text
            });
            company.ItemsSource = companyRepo.Get();
            this.UpdateLayout();
        }
        
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        private void Button_Click_Unit(object sender, RoutedEventArgs e)
        {
            if (company_Unit.SelectedIndex != -1)
            {

                decimal qwe = decimal.Parse(priceTB_Unit.Text);
                Company qwe2 = company_Unit.SelectedItem as Company;


                unitOfWork.PhoneRepository.Add(new Phone
                {
                    Company = qwe2,
                    Name = phoneTB_Unit.Text,
                    Price = qwe,
                });
                unitOfWork.Commit();
            }
            phone_Unit.ItemsSource = unitOfWork.PhoneRepository.Entities.ToList();
            this.UpdateLayout();
        }

        private void Button_Click_1_Unit(object sender, RoutedEventArgs e)
        {
            unitOfWork.CompanyRepository.Add(new Company
            {
                Name = companyTB_Unit.Text
            });
            unitOfWork.Commit();
            company_Unit.ItemsSource = unitOfWork.CompanyRepository.Entities.ToList();
            this.UpdateLayout();
        }
    }
}
