const BJConst = require('./BJConst.js');

class BJQuery {
    constructor(text) {
        this.searchstr = text;
        this.year = BJConst.YEAR.ALL_YEARS;
        this.freetorrent = BJConst.FREE_TORRENT.FALSE;
        this.taglist = undefined;
        this.tags_type = undefined;
        this.order_by = BJConst.ORDER_BY.TIME_ADDED;
        this.order_way = BJConst.ORDER_WAY.DESCENDING;
        this.category = [];
        this.platform = [];
        this.language = [];
        this.format = [];
        this.audio = [];
        this.resolution = [];
        this.video_codec = [];
        this.quality = [];
        this.audio_codec = [];
        this.movie_3D = undefined;
        this.genre = [];
    }

    getSearchstr() {
        return this.searchstr;
    };
    setSearchstr(searchstr) {
        this.searchstr = searchstr;
    };
    getYear() {
        return this.year;
    };
    setYear(year) {
        this.year = year;
    };
    getFreetorrent() {
        return this.freetorrent;
    };
    setFreetorrent(freetorrent) {
        this.freetorrent = freetorrent;
    };
    getTaglist() {
        return this.taglist;
    };
    setTaglist(taglist) {
        this.taglist = taglist;
    };
    getTags_type() {
        return this.tags_type;
    };
    setTags_type(tags_type) {
        this.tags_type = tags_type;
    };
    getOrder_by() {
        return this.order_by;
    };
    setOrder_by(order_by) {
        this.order_by = order_by;
    };
    getOrder_way() {
        return this.order_way;
    };
    setOrder_way(seaorder_wayrchstr) {
        this.order_way = order_way;
    };
    getCategory() {
        return this.category;
    };
    setCategory(category) {
        this.category = category;
    };
    getPatform() {
        return this.platform;
    };
    setPlatform(platform) {
        this.platform = platform;
    };
    getLanguage() {
        return this.language;
    };
    setLanguage(language) {
        this.language = language;
    };
    getFormat() {
        return this.format;
    };
    setFormat(format) {
        this.format = format;
    };
    getAudio() {
        return this.audio;
    };
    setAudio(audio) {
        this.audio = audio;
    };
    getResolution() {
        return this.resolution;
    };
    setResolution(resolution) {
        this.resolution = resolution;
    };
    getVideo_codec() {
        return this.video_codec;
    };
    setVideo_codec(video_codec) {
        this.video_codec = video_codec;
    };

    getAudio_codec() {
        return this.audio_codec;
    };
    setAudio_codec(audio_codec) {
        this.audio_codec = audio_codec;
    };
    getMovie_3D() {
        return this.movie_3D;
    };
    setMovie_3D(movie_3D) {
        this.movie_3D = movie_3D;
    };
    getGenre() {
        return this.genre;
    };
    setGenre(genre) {
        this.genre = genre;
    };
    getQuality() {
        return this.quality;
    };
    setQuality(quality) {
        this.quality = quality;
    };
}

module.exports = BJQuery;
