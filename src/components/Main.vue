<template>
  <h1>{{ lblTitle }}</h1>
  <div >
    <a :href="instUrl" target="_blank" class="mrg5r">Usage Instruction </a>
    <pvDropdown
      v-model="languageKey"
      :options="languages"
      optionLabel="name"
      placeholder="Choose language"
      class="mrg5r"
    />
    <pvButton v-if="bClipB" @click="qconvert" class="mrg5r p-error">
      {{ lblQChallenge }}
    </pvButton>
  </div>
  <div>
    <p class="p-d-flex p-jc-center">
      <pvButton @click="convert" v-show="!challengeFlag" class="mrg5r">
        {{ lblChallenge }}
      </pvButton>
      <pvButton
        @click="clearConvertedText"
        v-show="challengeFlag"
        class="mrg5r"
      >
        {{ lblClear }}
      </pvButton>
      <pvButton @click="showAnswer" v-show="challengeFlag" class="mrg5r">
        {{ ansLabel }}
      </pvButton>
    </p>
    <div class="textContainer">
      <div class="cvt" v-show="challengeFlag">
        <span v-for="(element, index) in convertedText" :key="index">
          <!-- show when the user has provided an article -->
          <span
            v-show="element.ans != ''"
            :class="{
              mrg10: true,
              missedAns: (element.ans !== element.article) & ansFlag,
              ans: !ansFlag,
              match: (element.ans === element.article) & ansFlag,
            }"
          >
            {{ element.ans }}
          </span>
          <span
            v-show="ansFlag & (element.article !== 'x')"
            :class="{
              article: element.ans !== element.article,
              match: element.ans === element.article,
              mrg10: true,
            }"
          >
            {{ element.article }}
          </span>
          <span
            @click="onWordRightClick(index, $event)"
            @contextmenu="onWordRightClick(index, $event)"
            class="mrg10 word"
          >
            {{ element.word }}
          </span>
        </span>
      </div>
      <br />
      <pvTextarea
        class="orgt"
        :rows="rowCount"
        :placeholder="lblTextAreaPh"
        v-model="originalText"
        v-if="!challengeFlag"
        :autoResize="true"
      ></pvTextarea>
    </div>
  </div>
  <ContextMenu ref="menu" :model="items" />
</template>
<script>
export default {
  components: {},
  name: "Main",
  props: {},
  data() {
    return {
      originalText: "",
      convertedText: "",
      rowCount: 5,
      message: "",
      hoverFlag: false,
      ansFlag: false,
      challengeFlag: false,
      selectedIndex: -1,
      bClipB: false,
      items: [
        {
          label: "the",
          icon: "pi pi-fw pi-caret-right",
          class: "",
          command: (e) => {
            this.convertedText[this.selectedIndex].ans = e.item.label;
          },
        },
        {
          label: "a",
          icon: "pi pi-fw pi-caret-right",
          command: (e) => {
            this.convertedText[this.selectedIndex].ans = e.item.label;
          },
        },
        {
          label: "an",
          icon: "pi pi-fw pi-caret-right",
          command: (e) => {
            this.convertedText[this.selectedIndex].ans = e.item.label;
          },
        },
        // {
        //   label: "his",
        //   icon: "pi pi-fw pi-caret-right",
        //   command: (e) => {
        //     this.convertedText[this.selectedIndex].ans = e.item.label;
        //   },
        // },
        // {
        //   label: "her",
        //   icon: "pi pi-fw pi-caret-right",
        //   command: (e) => {
        //     this.convertedText[this.selectedIndex].ans = e.item.label;
        //   },
        // },
        // {
        //   label: "our",
        //   icon: "pi pi-fw pi-caret-right",
        //   command: (e) => {
        //     this.convertedText[this.selectedIndex].ans = e.item.label;
        //   },
        // },
        // {
        //   label: "their",
        //   icon: "pi pi-fw pi-caret-right",
        //   command: (e) => {
        //     this.convertedText[this.selectedIndex].ans = e.item.label;
        //   },
        // },
        {
          label: "some",
          icon: "pi pi-fw pi-caret-right",
          command: (e) => {
            this.convertedText[this.selectedIndex].ans = e.item.label;
          },
        },
        {
          label: "cancel",
          icon: "pi pi-fw pi-caret-right",
          command: () => {
            this.convertedText[this.selectedIndex].ans = "";
          },
        },
      ],
      languageKey: { code: "JA" },
      languages: [
        { name: "日本語", code: "JA" },
        { name: "English", code: "EN" },
      ],
    };
  },
  methods: {
    convert: function () {
      // console.log(this.originalText.split(/\s+/));
      if (/^\s*$/.test(this.originalText)) {
        return;
      }
      this.originalText = this.originalText.replace(/\n+/g, " [CR] ");
      console.log(this.originalText);

      let convertedText = this.originalText.split(/\s+/);
      let cto = [];
      const reSm = /(^\W*)(a|an|the|some)$/;
      const reLg = /(^\W*)(A|An|The|Some|AN|THE|SOME)$/;
      this.ansFlag = false;

      // Preprocess non alphanumerics without spaces, i.e —
      let tmpStr = [];
      for (let i = 0; i < convertedText.length; i++) {
        const regPre = /(—)/;
        if (regPre.test(convertedText[i])) {
          const c = regPre.exec(convertedText[i])[1];
          // console.log(c, convertedText[i], convertedText[i].replace(c, ' ' + c + ' ').split(' '))
          tmpStr = tmpStr.concat(
            convertedText[i].replace(c, " " + c + " ").split(" ")
          );
        } else {
          tmpStr.push(convertedText[i]);
          // console.log(tmpStr);
        }
      }

      convertedText = tmpStr;
      for (let i = 0; i < convertedText.length; i++) {
        if (reSm.test(convertedText[i])) {
          let mAr = reSm.exec(convertedText[i]);
          cto.push({
            word: mAr[1] + convertedText[i + 1],
            article: mAr[2],
            ans: "",
          });
          i++;
        } else if (reLg.test(convertedText[i])) {
          let mAr = reLg.exec(convertedText[i]);
          cto.push({
            word:
              mAr[1] +
              convertedText[i + 1].charAt(0).toUpperCase() +
              convertedText[i + 1].substr(1, convertedText[i + 1].length - 1),
            article: mAr[2].toLowerCase(),
            ans: "",
          });
          i++;
        } else {
          cto.push({
            word: convertedText[i],
            article: "x",
            ans: "",
          });
        }
      }

      // this.message = JSON.stringify(cto);
      this.challengeFlag = true;
      this.convertedText = cto;
    },
    qconvert: function () {
      navigator.clipboard.readText().then((clipText) => {
        this.originalText = clipText;
        this.convert();
      });
    },
    onWordRightClick: function (index, event) {
      this.selectedIndex = index;
      this.$refs.menu.show(event);
    },
    clearConvertedText: function () {
      this.convertedText = "";
      this.originalText = "";
      this.ansFlag = false;
      this.challengeFlag = false;
    },
    mouseOverAction: function () {
      this.hoverFlag = true;
    },
    mouseLeaveAction: function () {
      this.hoverFlag = false;
    },
    showAnswer: function () {
      this.ansFlag = !this.ansFlag;
    },
  },
  computed: {
    ansLabel() {
      return this.ansFlag ? this.lblHideAns : this.lblShowAns;
    },
    lblHideAns() {
      const o = {
        JA: "解答を隠す",
        EN: "Hide Answers",
      };
      return o[this.languageKey.code];
    },
    lblShowAns() {
      const o = {
        JA: "解答表示",
        EN: "Show Answers",
      };
      return o[this.languageKey.code];
    },
    lblClear() {
      const o = {
        JA: "クリア",
        EN: "Clear",
      };
      return o[this.languageKey.code];
    },
    lblChallenge() {
      const o = {
        JA: "チャレンジ",
        EN: "Challenge",
      };
      return o[this.languageKey.code];
    },
    lblQChallenge() {
      const o = {
        JA: "クイックチャレンジ",
        EN: "Quick Challenge",
      };
      return o[this.languageKey.code];
    },
    lblTitle() {
      const o = {
        JA: "冠詞練習帳",
        EN: "English Article Master",
      };
      return o[this.languageKey.code];
    },
    lblTextAreaPh() {
      const o = {
        JA: "ここにテキストを貼り付けてください",
        EN: "Paste your text to exercize",
      };
      return o[this.languageKey.code];
    },
    instUrl() {
      const o = {
        JA:
          "https://docs.google.com/document/d/e/2PACX-1vQ5huH-pWufQn8_kj6iOylgcrAqkk7quxbfrdxdBBwYNM2yvRjryc5W6kg1Ihya2pF8hlI46OfzFN8E/pub",
        EN:
          "https://docs.google.com/document/d/e/2PACX-1vRf3CEzUOoBll3j5X0r50mqWqxsXFxUotbKU_XzS4fC2qGuQP30_yIgdZ_ZanTIuemTetDRSqneFdZQ/pub",
      };
      return o[this.languageKey.code];
    },
  },
  created() {
    if (navigator.clipboard) {
      this.bClipB = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cvt {
  border: double 10px red;
  text-align: left;
  width: 95%;
  margin: auto;
  display: inline-flex;
  flex-wrap: wrap;
  padding: 10px;
  border-radius: 25px;
}
.orgt {
  display: block;
  width: 95%;
  margin: auto;
  /* background-color: rgb(211, 205, 205); */
  color: rgb(197, 195, 195);
}
.textContainer {
  font-family: "tahoma", sans-serif;
  font-size: 20px;
  margin: auto;
  width: 95%;
}
.mrg10 {
  margin-right: 10px;
}
pvButton,
.mrg5r {
  margin-right: 5px;
}
.article {
  font-style: bold;
  color: yellow;
  background-color: red;
}

.missedAns {
  font-style: bold;
  color: white;
  background-color: black;
}

.ans {
  color: white;
  background-color: green;
}
.match {
  color: rgb(62, 128, 0);
  background-color: rgb(173, 228, 230);
  text-decoration: underline double rgb(62, 128, 0);
}
pvButton,
input,
select,
Textarea {
  font-family: inherit;
  font-size: 100%;
}
.word:hover {
  color: #0033cc;
  background-color: rgb(173, 228, 230);
  text-decoration: underline dotted blue;
}
</style>
