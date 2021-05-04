<template>
   <div class="container">
      <h2 style="text-align:center">ORFanBase Database Genes</h2>
    <div class="row">
        <div class="col s10 offset-s1">
            <div class="row">
                <div class="input-field col s5">
                    <input type="text" id="organismName" name="organismName" class="autocomplete validate" required="required">
                    <label for="organismName">Organism</label>
                </div>
                <div class="input-field col s5">
                    <select multiple>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="1">Strict ORFan</option>
                        <option value="2">Domain restricted gene</option>
                        <option value="3">Kingdom restricted gene</option>
                        <option value="4">Phylum restricted gene</option>
                        <option value="5">Class restricted gene</option>
                        <option value="6">Order restricted gene</option>
                        <option value="7">Family restricted gene</option>
                        <option value="8">Genus restricted gene</option>
                    </select>
                    <label>Orfan Level</label>
                </div>
            </div>
        </div>
        <div id="organismIcon" class="col s1">
        </div>
    </div>
    <div class="section">
        <div id="savedResultView" class="row">
            <div class="col s10 offset-s1 center-align">

                <table id="GenesViewTable" class="display" width="100%" cellspacing="0">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Organism</th>
                        <th>Gene ID</th>
                        <th>Description</th>
                        <th>Orfan Level</th>
                        <th>Analysis</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <th>Date</th>
                        <th>Organism</th>
                        <th>Gene ID</th>
                        <th>Description</th>
                        <th>Orfan Level</th>
                        <th>Analysis</th>
                        <th></th>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
  </div>
</template>

<script >
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: { },
})
export default class Orfanbase extends Vue {}
</script>
