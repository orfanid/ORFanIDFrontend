<template>
  <div class="container">
    <div class="row"><h4>Clamp Results</h4></div>
    <div class="row">
      <div class="col">
        <table
          id="clampresults"
          class="highlight striped"
          cellspacing="0"
          width="100%"
        >
          <thead>
            <tr>
              <th>Chromosome</th>
              <th>HumanGenes</th>
              <th>Retrotranspon</th>
              <th>Mouse Ortholog</th>
              <th>Dog Ortholog</th>
              <th>HumanParalog</th>
              <th>Protein Family</th>
              <th>Candidate orphan genes</th>
              <th>Protein coding orphan Genes</th>
              <th>Orphan Genes Download</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in results" :key="item">
              <td>{{ item.Chromosome }}</td>
              <td>{{ item.HumanGenes }}</td>
              <td>{{ item.Retrotranspon }}</td>
              <td>{{ item.MouseOrtholog }}</td>
              <td>{{ item.DogOrtholog }}</td>
              <td>{{ item.HumanParalog }}</td>
              <td>{{ item.Protein }}</td>
              <td>{{ item.Candidate }}</td>
              <td>{{ item.Proteincoding }}</td>
              <td>
                <a
                  v-bind:href="`../assets/data/chromosome${item.Chromosome}.fasta`"
                  ><i class="material-icons left">file_download</i></a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <ul class="pagination">
          <li class="disabled">
            <a href="#!"><i class="material-icons">chevron_left</i></a>
          </li>
            <li class="active"><a href="#!">1</a></li>
            <li><a href="#!">2</a></li>
          <li class="waves-effect">
            <a href="#!"><i class="material-icons">chevron_right</i></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {},
  methods: {
    ChromosomeUrl(obj) {
      return `../assets/data/chromosome${obj.Chromosome}.fasta`;
    },
  },
  data() {
    return {
      results: [
        {
          Chromosome: '1',
          HumanGenes: '5475',
          Retrotranspon: '893',
          MouseOrtholog: '1906',
          DogOrtholog: '2020',
          HumanParalog: '2155',
          Protein: '1892',
          Candidate: '2049',
          Proteincoding: '34',
        },
        {
          Chromosome: '2',
          HumanGenes: '4200',
          Retrotranspon: '752',
          MouseOrtholog: '1247',
          DogOrtholog: '1312',
          HumanParalog: '1420',
          Protein: '1762',
          Candidate: '2049',
          Proteincoding: '17',
        },
        {
          Chromosome: '3',
          HumanGenes: '3188',
          Retrotranspon: '613',
          MouseOrtholog: '1082',
          DogOrtholog: '1111',
          HumanParalog: '1189',
          Protein: '995',
          Candidate: '1179',
          Proteincoding: '13',
        },
        {
          Chromosome: '4',
          HumanGenes: '2657',
          Retrotranspon: '560',
          MouseOrtholog: '711',
          DogOrtholog: '729',
          HumanParalog: '830',
          Protein: '705',
          Candidate: '1111',
          Proteincoding: '18',
        },
        {
          Chromosome: '5',
          HumanGenes: '2988',
          Retrotranspon: '607',
          MouseOrtholog: '839',
          DogOrtholog: '901',
          HumanParalog: '960',
          Protein: '823',
          Candidate: '1232',
          Proteincoding: '4',
        },
        {
          Chromosome: '6',
          HumanGenes: '3064',
          Retrotranspon: '631',
          MouseOrtholog: '956',
          DogOrtholog: '991',
          HumanParalog: '1084',
          Protein: '971',
          Candidate: '1140',
          Proteincoding: '11',
        },
        {
          Chromosome: '7',
          HumanGenes: '3014',
          Retrotranspon: '573',
          MouseOrtholog: '910',
          DogOrtholog: '937',
          HumanParalog: '1057',
          Protein: '848',
          Candidate: '1208',
          Proteincoding: '33',
        },
        {
          Chromosome: '8',
          HumanGenes: '2485',
          Retrotranspon: '468',
          MouseOrtholog: '659',
          DogOrtholog: '687',
          HumanParalog: '753',
          Protein: '648',
          Candidate: '1131',
          Proteincoding: '4',
        },
        {
          Chromosome: '9',
          HumanGenes: '2333',
          Retrotranspon: '449',
          MouseOrtholog: '759',
          DogOrtholog: '784',
          HumanParalog: '790',
          Protein: '711',
          Candidate: '909',
          Proteincoding: '17',
        },
        {
          Chromosome: '10',
          HumanGenes: '2336',
          Retrotranspon: '423',
          MouseOrtholog: '705',
          DogOrtholog: '738',
          HumanParalog: '778',
          Protein: '677',
          Candidate: '989',
          Proteincoding: '8',
        },
      ], //   ["10","2336","423","705","738","778","677","989","8"],
    };
  },
};
</script>
