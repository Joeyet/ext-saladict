import { SelectionInfo } from '@/_helpers/selection'
import { DictID } from '@/app-config'
import { Word, Area as DBArea } from '@/background/database'
import { Omit } from '@/typings/helpers'

export const enum MsgType {
  /** Nothing */
  Null,
  /** Default */
  Default,

  /** is dict panel pinned? */
  IsPinned,

  /** is a standalone panel running? */
  QSPanelIDChanged,

  /** query background for standalone panel appearance */
  QueryQSPanel,

  OpenQSPanel,

  QSPanelSearchText,

  /** Mouse down, selection maybe empty */
  Selection,

  /** Ctrl/Command has been hit 3 times */
  TripleCtrl,

  /** Escape key is pressed */
  EscapeKey,

  /** Response the pageInfo of a page */
  PageInfo,

  /** Create a tab with the url */
  OpenURL,
  /** Play a audio src */
  PlayAudio,
  /** Search text with a dictionary and response the result */
  FetchDictResult,
  /** Request background proxy for current selection */
  PreloadSelection,
  /** Get clipboard content */
  GetClipboard,

  RequestCSS,

  IsInNotebook,
  SaveWord,
  WordSaved,
  DeleteWords,
  GetWordsByText,
  GetWords,
  GetSuggests,

  /** Popup page */
  TempDisabledState,

  /** Word page */
  EditWord,

  /** Query panel state */
  QueryPanelState,

  /** Manually emit selection event */
  EmitSelection,

  SyncServiceInit,
  SyncServiceDownload,
  SyncServiceUpload,

  /**
   * Background proxy sends back underlyingly
   */
  __PageInfo__,
}

/** iframe messaging */
export const enum PostMsgType {
  Selection = 'SALADICT_SELECTION',
}

export interface MsgSelection {
  readonly type: MsgType.Selection
  readonly selectionInfo: SelectionInfo
  readonly mouseX: number
  readonly mouseY: number
  /** inside panel? */
  readonly self: boolean
  readonly dbClick: boolean
  readonly shiftKey: boolean
  readonly ctrlKey: boolean
  readonly metaKey: boolean
  /** skip salad bowl and show panel directly */
  readonly instant: boolean
  /** force panel to skip reconciling position */
  readonly force: boolean
}

export interface PostMsgSelection extends Omit<MsgSelection, 'type'> {
  readonly type: PostMsgType.Selection
}

interface MsgOpenUrlWithPlaceholder {
  readonly type: MsgType.OpenURL
  readonly url: string
  readonly placeholder: true
  /** text to replace the placeholder */
  readonly text: string
  /** use browser.runtime.getURL? */
  readonly self?: boolean
}

interface MsgOpenUrlWithoutPlaceholder {
  readonly type: MsgType.OpenURL
  readonly url: string
  readonly placeholder?: false
  /** use browser.runtime.getURL? */
  readonly self?: boolean
}

export type MsgOpenUrl = MsgOpenUrlWithoutPlaceholder | MsgOpenUrlWithPlaceholder

export interface MsgAudioPlay {
  readonly type: MsgType.PlayAudio
  /** empty string for stoping */
  readonly src: string
}

export interface MsgFetchDictResult {
  readonly type: MsgType.FetchDictResult
  readonly id: DictID
  readonly text: string
  /** pass to engine search function as the third argument */
  readonly payload: {
    isPDF: boolean
    [index: string]: any
  }
}

export interface MsgIsInNotebook {
  readonly type: MsgType.IsInNotebook
  readonly info: SelectionInfo
}

export interface MsgSaveWord {
  readonly type: MsgType.SaveWord
  readonly area: DBArea
  readonly info: SelectionInfo & { readonly date?: number }
}

export interface MsgDeleteWords {
  readonly type: MsgType.DeleteWords
  readonly area: DBArea
  readonly dates?: number[]
}

export interface MsgGetWordsByText {
  readonly type: MsgType.GetWordsByText
  readonly area: DBArea
  readonly text: string
}

export interface MsgGetWords {
  readonly type: MsgType.GetWords
  readonly area: DBArea
  readonly itemsPerPage?: number
  readonly pageNum?: number
  readonly filters?: { [field: string]: string[] | undefined }
  readonly sortField?: string
  readonly sortOrder?: 'ascend' | 'descend' | false
  readonly searchText?: string
}

export interface MsgGetSuggests {
  readonly type: MsgType.GetSuggests
  readonly text: string
}

export interface MsgGetWordsResponse {
  readonly total: number
  readonly words: Word[]
}

export type MsgTempDisabledState = {
  readonly type: MsgType.TempDisabledState
  readonly op: 'get'
} | {
  readonly type: MsgType.TempDisabledState
  readonly op: 'set'
  readonly value: boolean
}

export interface MsgEditWord {
  readonly type: MsgType.EditWord
  readonly word: Word
}

export interface MsgIsPinned {
  readonly type: MsgType.IsPinned
  readonly isPinned: boolean
}

export interface MsgQSPanelIDChanged {
  readonly type: MsgType.QSPanelIDChanged
  readonly flag: boolean
}

export interface MsgQueryQSPanel {
  readonly type: MsgType.QueryQSPanel
}

export interface MsgQSPanelSearchText {
  readonly type: MsgType.QSPanelSearchText
  readonly info: SelectionInfo
}

export type MsgQueryQSPanelResponse = boolean

export interface MsgQueryPanelState {
  readonly type: MsgType.QueryPanelState
  /** object path, default returns the whole state */
  readonly path?: string
}

export interface MsgSyncServiceInit {
  readonly type: MsgType.SyncServiceInit
  readonly config: any
}

export interface MsgSyncServiceDownload {
  readonly type: MsgType.SyncServiceDownload
  readonly force?: boolean
}

export interface MsgSyncServiceUpload {
  readonly type: MsgType.SyncServiceUpload
  readonly force?: boolean
}
