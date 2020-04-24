function getUrls() {
  const urls = {};
  urls.uniqueVsTotal =
    "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/wikistorestitchapp-vgkfz/service/wikiStoreStats/incoming_webhook/s_ch_6_clicks_unique_vs_total?startDate=2019-06-01&endDate=2020-06-01&secret=wikistore";

  urls.mobileVsDesktop =
    "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/wikistorestitchapp-vgkfz/service/wikiStoreStats/incoming_webhook/s_ch_1_mobiles_vs_desktops?startDate=2019-01-01&endDate=2020-05-06&secret=wikistore";

  urls.clicksByDaysOfWeek =
    "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/wikistorestitchapp-vgkfz/service/wikiStoreStats/incoming_webhook/s_ch_3_clicks_by_days_of_week?startDate=2019-05-05&endDate=2020-05-05&secret=wikistore";

  urls.clicksByHoursOfDay =
    "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/wikistorestitchapp-vgkfz/service/wikiStoreStats/incoming_webhook/s_ch_4_clicks_by_hours_of_day?startDate=2019-05-05&endDate=2020-06-06&secret=wikistore";

  urls.clicksByDaysOfWeek =
    "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/wikistorestitchapp-vgkfz/service/wikiStoreStats/incoming_webhook/s_ch_3_clicks_by_days_of_week?startDate=2019-05-05&endDate=2020-05-05&secret=wikistore";

  urls.dailyClicksForTimePeriod =
    "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/wikistorestitchapp-vgkfz/service/wikiStoreStats/incoming_webhook/s_ch_7_daily_clicks_for_time_period?startDate=2020-01-03&endDate=2020-04-30&secret=wikistore";

  return urls;
}
