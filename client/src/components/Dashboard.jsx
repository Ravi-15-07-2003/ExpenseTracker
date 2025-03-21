// client/src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('');
  const [chartType, setChartType] = useState('bar');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchExpenses();
    }
  }, [navigate]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/api/expenses', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setExpenses(res.data);
    } catch (error) {
      console.error('Error fetching expenses', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredExpenses = filter
    ? expenses.filter(exp =>
        exp.title.toLowerCase().includes(filter.toLowerCase())
      )
    : expenses;

  const totalIncome = expenses.reduce(
    (acc, exp) => (exp.type === 'income' ? acc + Number(exp.amount) : acc),
    0
  );
  const totalExpense = expenses.reduce(
    (acc, exp) => (exp.type === 'expense' ? acc + Number(exp.amount) : acc),
    0
  );
  const netBalance = totalIncome - totalExpense;

  const chartData = {
    labels: filteredExpenses.map(exp => exp.title),
    datasets: [
      {
        label: 'Amount',
        data: filteredExpenses.map(exp =>
          exp.type === 'income' ? Number(exp.amount) : -Number(exp.amount)
        ),
        backgroundColor: filteredExpenses.map(exp =>
          exp.type === 'income'
            ? (chartType === 'line' ? 'rgba(0,123,255,0.6)' : 'rgba(40,167,69,0.6)')
            : 'rgba(220,53,69,0.6)'
        ),
        borderColor: filteredExpenses.map(exp =>
          exp.type === 'income'
            ? (chartType === 'line' ? 'rgba(0,123,255,1)' : 'rgba(40,167,69,1)')
            : 'rgba(220,53,69,1)'
        ),
        borderWidth: 3,
        fill: false,
        pointBackgroundColor: filteredExpenses.map(exp =>
          exp.type === 'income' ? 'rgba(40,167,69,1)' : 'rgba(220,53,69,1)'
        ),
        pointBorderColor: filteredExpenses.map(exp =>
          exp.type === 'income' ? 'rgba(40,167,69,1)' : 'rgba(220,53,69,1)'
        ),
      },
    ],
  };

  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ['rgba(40,167,69,0.6)', 'rgba(220,53,69,0.6)'],
        borderColor: ['rgba(40,167,69,1)', 'rgba(220,53,69,1)'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Expense Tracker Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>
      
      <div className="summary-section">
        <div className="summary-item income">
          <h4>Income</h4>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-item expense">
          <h4>Expense</h4>
          <p>${totalExpense.toFixed(2)}</p>
        </div>
        <div className="summary-item balance">
          <h4>Balance</h4>
          <p className={netBalance >= 0 ? 'positive' : 'negative'}>
            {netBalance >= 0 ? `+${netBalance.toFixed(2)}` : netBalance.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="form-section">
        <ExpenseForm onExpenseAdded={fetchExpenses} />
      </div>
      
      <div className="filter-section">
        <label htmlFor="filter">Search by Title:</label>
        <input
          type="text"
          id="filter"
          placeholder="Enter title to search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      
      <div className="list-section">
        <ExpenseList expenses={filteredExpenses} refreshExpenses={fetchExpenses} />
      </div>
      
      <div className="chart-section">
        <div className="chart-header">
          <h3>Transactions Overview</h3>
          <div className="chart-toggle">
            <button onClick={() => setChartType('bar')} className={chartType === 'bar' ? 'active' : ''}>
              Bar Chart
            </button>
            <button onClick={() => setChartType('line')} className={chartType === 'line' ? 'active' : ''}>
              Line Chart
            </button>
            <button onClick={() => setChartType('pie')} className={chartType === 'pie' ? 'active' : ''}>
              Pie Chart
            </button>
          </div>
        </div>
        <div className={`chart-container ${chartType === 'pie' ? 'center-pie' : ''}`} key={chartType}>
          {chartType === 'bar' ? (
            <Bar data={chartData} options={chartOptions} />
          ) : chartType === 'line' ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Pie data={pieData} options={pieOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
