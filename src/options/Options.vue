<template>
<div>
  <transition name="dropdown">
    <div class="config-updated" v-if="isShowConfigUpdated">
      {{ i18n('opt_storage_updated') }}
    </div>
  </transition>
  <div class="opt-container">
    <h1 class="page-header">{{ i18n('opt_title') }}</h1>

    <div class="opt-item">
      <div class="opt-item__header">
        <strong>{{ i18n('opt_app_active_title') }}</strong>
      </div>
      <div class="opt-item__body">
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="config.active"> {{ i18n('opt_app_active') }}
          </label>
        </div>
      </div>
      <div class="opt-item__description-wrap">
        <p class="opt-item__description" v-html="i18n('opt_app_active_description')"></p>
      </div>
    </div><!-- opt-item -->

    <div class="opt-item">
      <div class="opt-item__header">
        <strong>{{ i18n('opt_mode_title') }}</strong>
      </div>
      <div class="opt-item__body">
        <div class="radio">
          <label class="radio-inline">
            <input type="radio" value="icon" v-model="config.mode"> {{ i18n('opt_mode_icon') }}
          </label>
          <label class="radio-inline">
            <input type="radio" value="direct" v-model="config.mode"> {{ i18n('opt_mode_direct') }}
          </label>
          <label class="radio-inline">
            <input type="radio" value="ctrl" v-model="config.mode"> {{ i18n('opt_mode_ctrl') }}
          </label>
        </div>
      </div>
      <div class="opt-item__description-wrap">
        <p class="opt-item__description" v-html="i18n('opt_mode_description')"></p>
      </div>
    </div><!-- opt-item -->

    <div class="opt-item">
      <div class="opt-item__header">
        <strong>{{ i18n('opt_triple_ctrl_title') }}</strong>
      </div>
      <div class="opt-item__body">
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="config.tripleCtrl"> {{ i18n('opt_triple_ctrl') }}
          </label>
        </div>
      </div>
      <div class="opt-item__description-wrap">
        <p class="opt-item__description" v-html="i18n('opt_triple_ctrl_description')"></p>
      </div>
    </div><!-- opt-item -->

    <div class="opt-item">
      <div class="opt-item__header">
        <strong>{{ i18n('opt_language_title') }}</strong>
      </div>
      <div class="opt-item__body">
        <div class="checkbox">
          <label class="checkbox-inline">
            <input type="checkbox" v-model="config.language.chinese"> {{ i18n('opt_language_chinese') }}
          </label>
          <label class="checkbox-inline">
            <input type="checkbox" v-model="config.language.english"> {{ i18n('opt_language_english') }}
          </label>
        </div>
      </div>
      <div class="opt-item__description-wrap">
        <p class="opt-item__description" v-html="i18n('opt_language_mode_description')"></p>
      </div>
    </div><!-- opt-item -->

    <div class="opt-item">
      <div class="opt-item__header">
        <strong>{{ i18n('opt_dicts_title') }}</strong>
      </div>
      <div class="opt-item__body">
        <header class="opt-dict__header">
          <button type="button" class="btn btn-default btn-xs"
            v-if="dictsUnselected.length > 0"
            @click="isShowAddDictsPanel = true"
          >{{ i18n('opt_dicts_btn_add') }}</button>
          <transition name="fade">
            <div class="modal show text-left" v-if="isShowAddDictsPanel">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" @click="isShowAddDictsPanel = false">&times;</button>
                    <h4 class="modal-title">{{ i18n('opt_dicts_add_panel_title') }}</h4>
                  </div>
                  <div class="modal-body">
                    <div class="panel-group">
                      <transition-group name="dict-panel-list">
                        <div class="panel panel-default dict-panel"
                          v-for="(id, i) in dictsUnselected"
                          :key="id"
                        >
                          <div class="dict-panel__header" @click="handleAddDict(id)">
                            <img class="dict-panel__icon" :src="dicts[id].favicon">
                            <strong class="dict-panel__title">{{ i18n('dict_' + id) }}</strong>
                            <button type="button" class="close">&#10004;</button>
                          </div>
                        </div>
                      </transition-group>
                    </div>
                  </div>
                </div>
              </div>
            </div> <!--modal-->
          </transition>
        </header>
        <div class="panel-group">
          <draggable
            v-model="config.dicts.selected"
            :options="{animation: 200}"
            @start="clearDictsHeight"
          >
            <transition-group name="dict-panel-list">
              <div class="panel panel-default dict-panel"
                v-for="(id, i) in config.dicts.selected"
                :key="id"
              >
                <div class="dict-panel__header" @click="handlePanelHeadClick(id, i)">
                  <img class="dict-panel__icon" :src="dicts[id].favicon">
                  <strong class="dict-panel__title">{{ i18n('dict_' + id) }}</strong>
                  <button type="button" class="close" @click.stop="config.dicts.selected.splice(i, 1)">&times;</button>
                </div>
                <div class="dict-panel__body"
                  ref="dict"
                  :style="{height: dicts[id].height + 'px'}"
                ><div class="panel-body">
                  <div class="input-group">
                    <div class="input-group-addon">{{ i18n('opt_dict_default_height') }}</div>
                    <input type="number" class="form-control" v-model="config.dicts.all[id].preferredHeight">
                    <div class="input-group-addon">px</div>
                  </div>
                </div></div>
              </div>
              <div key='___'></div><!--An empty div to fix a tricky bug on draggable-->
            </transition-group>
          </draggable>
        </div>
      </div>
      <div class="opt-item__description-wrap">
        <p class="opt-item__description" v-html="i18n('opt_dicts_description')"></p>
      </div>
    </div><!-- opt-item -->

  </div>
  <transition appear name="popup">
    <div class="frame-container">
      <iframe class="saladict-frame"
        name="saladict-frame"
        frameBorder="0"
        :src="frameSource"
        :style="{height: panelHeight + 'px'}"
      ></iframe>
    </div>
  </transition>
</div>
</template>

<script>
import {storage, message} from 'src/helpers/chrome-api'
import defaultConfig from 'src/app-config'
import Draggable from 'vuedraggable'

export default {
  name: 'options',
  data () {
    return {
      config: defaultConfig,
      dicts: {},

      text: 'salad',

      frameSource: chrome.runtime.getURL('panel.html'),

      isShowConfigUpdated: false,
      showConfigUpdatedTimeout: undefined,

      isShowAddDictsPanel: false
    }
  },
  methods: {
    i18n (key) {
      return chrome.i18n.getMessage(key)
    },
    clearDictsHeight () {
      this.config.dicts.selected.forEach(id => {
        this.dicts[id].height = 0
      })
    },
    handlePanelHeadClick (id, i) {
      let height = this.dicts[id].height > 0 ? 0 : this.$refs.dict[i].firstChild.offsetHeight
      this.clearDictsHeight()
      this.dicts[id].height = height
    },
    handleAddDict (id) {
      let selected = this.config.dicts.selected
      selected.push(id)
      if (Object.keys(this.config.dicts.all).length === selected.length) {
        this.isShowAddDictsPanel = false
      }
    }
  },
  watch: {
    config: {
      deep: true,
      handler () {
        // ignore the first auto update
        if (this.showConfigUpdatedTimeout === undefined) {
          this.showConfigUpdatedTimeout = null
          return
        }

        storage.sync.set({config: this.config})
          .then(() => {
            this.isShowConfigUpdated = true
            if (this.showConfigUpdatedTimeout) { clearTimeout(this.showConfigUpdatedTimeout) }
            this.showConfigUpdatedTimeout = setTimeout(() => {
              this.isShowConfigUpdated = false
              this.showConfigUpdatedTimeout = null
            }, 1500)
          })
      }
    },
    'config.dicts': {
      deep: true,
      handler () {
        message.send({msg: 'SEARCH_TEXT_SELF', text: this.text})
      }
    }
  },
  computed: {
    panelHeight () {
      const allDicts = this.config.dicts.all
      // header + each dictionary
      const preferredHeight = 30 + this.config.dicts.selected.reduce((sum, id) => {
        let minHeight = 110
        if (allDicts[id] && allDicts[id].minHeight) {
          minHeight = allDicts[id].minHeight
        }
        return sum + minHeight
      }, 0)
      const maxHeight = window.innerHeight * 2 / 3
      return preferredHeight > maxHeight ? maxHeight : preferredHeight
    },
    dictsUnselected () {
      let selected = this.config.dicts.selected
      return Object.keys(this.config.dicts.all).filter(d1 => !selected.some(d2 => d1 === d2))
    }
  },
  components: {
    Draggable
  },
  beforeCreate () {
    document.title = 'Saladict Options'
  },
  created () {
    let allDicts = this.config.dicts.all
    let dicts = {}
    Object.keys(allDicts).forEach(id => {
      dicts[id] = {
        favicon: chrome.runtime.getURL('assets/dicts/' + allDicts[id].favicon),
        height: 0
      }
    })
    this.dicts = dicts

    storage.sync.get('config', result => {
      if (result.config) {
        this.config = result.config
      }
    })
  },
  mounted () {
    // unfold the fisrt dictionary
    setTimeout(() => {
      this.handlePanelHeadClick(this.config.dicts.selected[0], 0)
    }, 1000)

    message.on('PANEL_READY', () => {
      message.send({msg: 'SEARCH_TEXT_SELF', text: this.text})
    })

    let currentTabID
    chrome.tabs.getCurrent(tab => {
      currentTabID = tab.id

      // monitor search text
      message.on('FETCH_DICT_RESULT', (data, sender) => {
        if (currentTabID === sender.tab.id) {
          this.text = data.text
        }
      })
    })
  }
}
</script>

<style lang="scss">
/*------------------------------------*\
   Bootstrap
\*------------------------------------*/
@import "~bootstrap-sass/assets/stylesheets/bootstrap/variables";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/mixins";

// Reset and dependencies
@import "~bootstrap-sass/assets/stylesheets/bootstrap/normalize";

// Core CSS
@import "~bootstrap-sass/assets/stylesheets/bootstrap/scaffolding";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/type";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/grid";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/forms";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/buttons";

// Components
@import "~bootstrap-sass/assets/stylesheets/bootstrap/button-groups";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/input-groups";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/panels";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/close";
@import "~bootstrap-sass/assets/stylesheets/bootstrap/alerts";

// Components w/ JavaScript
@import "~bootstrap-sass/assets/stylesheets/bootstrap/modals";

/*------------------------------------*\
   Base
\*------------------------------------*/
html {
  overflow-y: scroll;
}

body {
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", "Hiragino Sans GB W3", "Microsoft YaHei UI", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}

/* type.css */
kbd {
  display: inline-block;
  padding: .25em .5em .2em;
  margin-left: .25em;
  margin-right: .25em;
  font: 75%/1 monaco, menlo, consolas, 'courier new', courier, monospace;
  border: solid 1px #ccc;
  border-bottom-color: #bbb;
  border-radius: 3px;
  white-space: nowrap;
  word-wrap: normal;
  text-transform: capitalize;
  color: #555;
  background-color: #fefefe;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent);
  box-shadow: 0 2px 0 #ccc, 0 3px 1px #999, inset 0 1px 1px #fff;
}

/*------------------------------------*\
   Components
\*------------------------------------*/
.config-updated {
  @extend .alert-success;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $global-zindex-popover;
  padding: 5px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.opt-container {
  margin-right: 500px;
  padding: 0 15px;
}

.opt-item {
  @extend .row;
  position: relative;
  margin-bottom: 10px;
}

.opt-item__header {
  @extend .col-sm-2;
  text-align: right;
}

.opt-item__body {
  @extend .col-sm-6;
  background-color: #fafafa;

  &:hover + .opt-item__description-wrap {
    opacity: 1;
  }
}

.opt-item__description-wrap {
  @extend .col-sm-4;
  position: absolute;
  right: 0;
  padding-left: 15px;
  opacity: 0;
  transition: opacity 400ms;
}

.opt-item__description {
  border-left: 1px solid #666;
  padding-left: 15px;
  line-height: 1.8;
  color: #666;
}

.opt-dict__header {
  text-align: right;
  margin: 15px 0;
}

.dict-panel__icon {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

.dict-panel__title {
  cursor: pointer;
}

.dict-panel__header {
  @extend .panel-heading;
  cursor: pointer;
}

.dict-panel__body {
  transition: height 600ms;
  overflow: hidden;
}

.frame-container {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 500px;
}

.saladict-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  overflow: hidden;
  border: 0 none;
  box-shadow: rgba(0, 0, 0, 0.8) 0px 4px 23px -6px;
  transition: all 1s;
}

/*------------------------------------*\
   States
\*------------------------------------*/
// Utility classes
@import "~bootstrap-sass/assets/stylesheets/bootstrap/utilities";

.dict-panel {
  transition: all 600ms;
}

.dict-panel-list-enter, .dict-panel-list-leave-to {
  opacity: 0;
}

.dict-panel-list-leave-active {
  position: absolute;
  left: 15px;
  right: 15px;
}

.sortable-drag,
.sortable-ghost {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 500ms;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}

.popup-enter-active {
  transition: all 1.5s 1s;
}
.popup-enter {
  opacity: 0;
  transform: translate3d(0px, 40px, 0px);
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: transform 500ms;
}
.dropdown-enter, .dropdown-leave-active {
  transform: translateY(-100%);
}

@media (max-width: 860px) {
  .opt-container {
    width: 100%;
  }

  .frame-container {
    display: none;
  }
}
</style>