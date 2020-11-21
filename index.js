const uname = "davidfegyver"
const pass = ""

var base64 = window.btoa(uname + ':' + pass);

var chartColors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
];

function getColor() {
    return chartColors[Math.floor(Math.random() * chartColors.length)];
}
async function getData(url) {
    var request = new XMLHttpRequest();
    request.open('GET', "https://api.github.com/" + url, false);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.setRequestHeader('Authorization', 'Basic ' + base64);
    request.setRequestHeader('Accept', 'application/json');
    request.send();

    return JSON.parse(request.responseText);
}

window.onload = async function () {

    var repos = await getData(`users/${uname}/repos`);

    for (let i = 0; i < repos.length; i++) { // loop througt your repos,
        let views = await getData(`repos/${repos[i].full_name}/traffic/views`);
        let clones = await getData(`repos/${repos[i].full_name}/traffic/clones`);
        repos[i].viewCount = views.count;
        repos[i].uniqueViewCount = views.uniques;
        repos[i].cloneCount = clones.count;
        console.log(clones)
    }

    console.log(repos.map(element => element.viewCount))
    var barChartData = {
        labels: repos.map(element => element.name),
        datasets: [{
            label: "Views",
            backgroundColor: getColor(),
            borderColor: getColor(),
            data: repos.map(element => element.viewCount),
            fill: false
        },
        {
            label: "Unique views",
            backgroundColor: getColor(),
            borderColor: getColor(),
            data: repos.map(element => element.uniqueViewCount),
            fill: false
        },
        {
            label: "Clones",
            backgroundColor: getColor(),
            borderColor: getColor(),
            data: repos.map(element => element.cloneCount),
            fill: false
        }]
    };
 //repos.map(element => element.uniqueViewCount)
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Your repos"
            }
        }
    });

};