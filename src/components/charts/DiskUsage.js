import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  data () {
    return {
      interval: null
    }
  },
  methods: {
    graph () {
      var used = 5
      var free = 5
      this.renderChart({
        labels: ['Espaço Ocupado', 'Espaço Disponível'],
        datasets: [
          {
            backgroundColor: [
              '#DD1B16',
              '#41B883'
            ],
            data: [used, free]
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontColor: '#000'
          }
        }
      })
    }
  },
  mounted () {
    this.graph()

    this.interval = setInterval(() => { this.graph() }, 60000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
