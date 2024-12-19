document.addEventListener('DOMContentLoaded', function () {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);

    const temperatureForm = document.getElementById('temperatureForm');
    const temperatureChart = document.getElementById('temperatureChart').getContext('2d');
    const temperatureList = document.getElementById('temperatureList');
    const openModalButton = document.getElementById('openModalButton');
    const modal = document.getElementById('temperatureModal');
    const closeModalButton = document.querySelector('.modal .close');

    let temperatureData = JSON.parse(localStorage.getItem('temperatureData')) || [];
    const chart = new Chart(temperatureChart, {
        type: 'line',
        data: {
            labels: temperatureData.map(data => data.date),
            datasets: [{
                label: 'Temperature',
                data: temperatureData.map(data => data.temperature),
                borderColor: '#007bff',
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    temperatureForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const date = document.getElementById('dateInput').value;
        const temperature = document.getElementById('temperatureInput').value;

        addTemperatureData(date, temperature);
        temperatureForm.reset();
    });

    openModalButton.addEventListener('click', function () {
        modal.style.display = 'block';
        updateTemperatureList();
    });

    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    function addTemperatureData(date, temperature) {
        temperatureData.push({ date, temperature });
        localStorage.setItem('temperatureData', JSON.stringify(temperatureData));
        updateChart();
    }

    function removeTemperatureData(index) {
        temperatureData.splice(index, 1);
        localStorage.setItem('temperatureData', JSON.stringify(temperatureData));
        updateChart();
        updateTemperatureList();
    }

    function updateChart() {
        chart.data.labels = temperatureData.map(data => data.date);
        chart.data.datasets[0].data = temperatureData.map(data => data.temperature);
        chart.update();
    }

    function updateTemperatureList() {
        temperatureList.innerHTML = '';
        temperatureData.forEach((data, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${data.date}: ${data.temperature}°C`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => removeTemperatureData(index));
            listItem.appendChild(deleteButton);
            temperatureList.appendChild(listItem);
        });
    }
});