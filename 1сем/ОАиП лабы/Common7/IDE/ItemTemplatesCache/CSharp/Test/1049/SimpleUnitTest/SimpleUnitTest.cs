﻿using System;
using System.Text;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ == 3.5)using System.Linq;$endif$$if$ ($targetframeworkversion$ == 4.0)using System.Linq;
$endif$using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace $rootnamespace$
{
	/// <summary>
	/// Сводное описание для $safeitemname$
	/// </summary>
	[TestClass]
	public class $safeitemname$
	{
		public $safeitemname$()
		{
			//
			// TODO: добавьте здесь логику конструктора
			//
		}

		private TestContext testContextInstance;

		/// <summary>
		///Получает или устанавливает контекст теста, в котором предоставляются
		///сведения о текущем тестовом запуске и обеспечивается его функциональность.
		///</summary>
		public TestContext TestContext
		{
			get
			{
				return testContextInstance;
			}
			set
			{
				testContextInstance = value;
			}
		}

		#region Дополнительные атрибуты тестирования
		//
		// При написании тестов можно использовать следующие дополнительные атрибуты:
		//
		// ClassInitialize используется для выполнения кода до запуска первого теста в классе
		// [ClassInitialize()]
		// public static void MyClassInitialize(TestContext testContext) { }
		//
		// ClassCleanup используется для выполнения кода после завершения работы всех тестов в классе
		// [ClassCleanup()]
		// public static void MyClassCleanup() { }
		//
		// TestInitialize используется для выполнения кода перед запуском каждого теста 
		// [TestInitialize()]
		// public void MyTestInitialize() { }
		//
		// TestCleanup используется для выполнения кода после завершения каждого теста
		// [TestCleanup()]
		// public void MyTestCleanup() { }
		//
		#endregion

		[TestMethod]
		public void TestMethod1()
		{
			//
			// TODO: добавьте здесь логику теста
			//
		}
	}
}
