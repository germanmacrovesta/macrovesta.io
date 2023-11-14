
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.16.2
 * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
 */
Prisma.prismaVersion = {
  client: "4.16.2",
  engine: "4bc8b6e1b66cb932731fb1bdbbc550d1e010de81"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ExampleScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.CompanyScalarFieldEnum = {
  record_id: 'record_id',
  name: 'name',
  type: 'type',
  tier: 'tier',
  access_to_marketplace: 'access_to_marketplace',
  created_at: 'created_at',
  company_manager_id: 'company_manager_id',
  macrovesta_manager_id: 'macrovesta_manager_id'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  role: 'role',
  company_id: 'company_id',
  selected_company_id: 'selected_company_id',
  submittedSurvey: 'submittedSurvey',
  image: 'image'
};

exports.Prisma.NotificationScalarFieldEnum = {
  record_id: 'record_id',
  title: 'title',
  description: 'description',
  is_read: 'is_read',
  user_id: 'user_id',
  date_created: 'date_created'
};

exports.Prisma.MarketplaceScalarFieldEnum = {
  record_id: 'record_id',
  product: 'product',
  category: 'category',
  quantity: 'quantity',
  quality: 'quality',
  description: 'description',
  image_url: 'image_url',
  price_usd: 'price_usd',
  added_by: 'added_by',
  hvi_file: 'hvi_file',
  shipment: 'shipment',
  payment_terms: 'payment_terms',
  date_created: 'date_created',
  expiry_date: 'expiry_date',
  reserved_by: 'reserved_by'
};

exports.Prisma.MarketplaceAgentScalarFieldEnum = {
  record_id: 'record_id',
  marketplace_id: 'marketplace_id',
  agent_id: 'agent_id',
  date_created: 'date_created'
};

exports.Prisma.MarketplaceBuyerScalarFieldEnum = {
  record_id: 'record_id',
  marketplace_id: 'marketplace_id',
  buyer_id: 'buyer_id',
  date_created: 'date_created'
};

exports.Prisma.A_indexScalarFieldEnum = {
  record_id: 'record_id',
  date: 'date',
  a_index: 'a_index',
  ice_highest_open_interest_17_months: 'ice_highest_open_interest_17_months',
  cc_index: 'cc_index',
  mcx: 'mcx',
  cepea: 'cepea'
};

exports.Prisma.Fixed_cottonScalarFieldEnum = {
  company_id: 'company_id',
  record_id: 'record_id',
  contract_number: 'contract_number',
  futures_month: 'futures_month',
  basis: 'basis',
  fixed_price_without_basis: 'fixed_price_without_basis',
  amount_fixed: 'amount_fixed',
  added_by: 'added_by',
  date_created: 'date_created'
};

exports.Prisma.Unfixed_cottonScalarFieldEnum = {
  record_id: 'record_id',
  company_id: 'company_id',
  contract_number: 'contract_number',
  futures_month: 'futures_month',
  basis: 'basis',
  fix_by: 'fix_by',
  total_amount: 'total_amount',
  amount_remaining: 'amount_remaining',
  added_by: 'added_by',
  date_created: 'date_created'
};

exports.Prisma.Strategy_logScalarFieldEnum = {
  record_id: 'record_id',
  company_id: 'company_id',
  title: 'title',
  text: 'text',
  added_by: 'added_by',
  date_created: 'date_created'
};

exports.Prisma.Producer_production_estimatesScalarFieldEnum = {
  record_id: 'record_id',
  company_id: 'company_id',
  season: 'season',
  production_estimate: 'production_estimate',
  yield_estimate: 'yield_estimate',
  added_by: 'added_by',
  date_created: 'date_created'
};

exports.Prisma.Producer_cost_estimatesScalarFieldEnum = {
  record_id: 'record_id',
  company_id: 'company_id',
  season: 'season',
  cost_estimate_dollar_per_hectare: 'cost_estimate_dollar_per_hectare',
  cost_estimate_cent_per_pound: 'cost_estimate_cent_per_pound',
  added_by: 'added_by',
  date_created: 'date_created'
};

exports.Prisma.Producer_commercialisation_estimatesScalarFieldEnum = {
  record_id: 'record_id',
  company_id: 'company_id',
  season: 'season',
  percentage_sold: 'percentage_sold',
  added_by: 'added_by',
  date_created: 'date_created'
};

exports.Prisma.Bug_reportScalarFieldEnum = {
  record_id: 'record_id',
  type: 'type',
  title: 'title',
  text: 'text',
  added_by: 'added_by',
  date_created: 'date_created'
};

exports.Prisma.SuggestionsScalarFieldEnum = {
  record_id: 'record_id',
  type: 'type',
  text: 'text',
  added_by: 'added_by',
  date_created: 'date_created'
};

exports.Prisma.Upcoming_changesScalarFieldEnum = {
  record_id: 'record_id',
  type: 'type',
  title: 'title',
  text: 'text',
  image: 'image',
  planned_released_date: 'planned_released_date'
};

exports.Prisma.ConclusionScalarFieldEnum = {
  record_id: 'record_id',
  text: 'text',
  date_created: 'date_created'
};

exports.Prisma.Demo_RequestsScalarFieldEnum = {
  record_id: 'record_id',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  company_name: 'company_name',
  company_type: 'company_type',
  preferred_date: 'preferred_date',
  preferred_time: 'preferred_time',
  date_created: 'date_created'
};

exports.Prisma.General_InquiriesScalarFieldEnum = {
  record_id: 'record_id',
  name: 'name',
  email: 'email',
  company: 'company',
  message: 'message',
  date_created: 'date_created'
};

exports.Prisma.Things_to_reviewScalarFieldEnum = {
  record_id: 'record_id',
  added_by: 'added_by',
  table: 'table',
  type: 'type',
  thing_id: 'thing_id',
  information: 'information',
  date_created: 'date_created'
};

exports.Prisma.External_LinksScalarFieldEnum = {
  record_id: 'record_id',
  type: 'type',
  url: 'url',
  language: 'language',
  date_created: 'date_created'
};

exports.Prisma.Supply_and_demandScalarFieldEnum = {
  record_id: 'record_id',
  date: 'date',
  season: 'season',
  country: 'country',
  beginning_stocks_usda: 'beginning_stocks_usda',
  beginning_stocks_eap: 'beginning_stocks_eap',
  production_usda: 'production_usda',
  production_eap: 'production_eap',
  imports_usda: 'imports_usda',
  imports_eap: 'imports_eap',
  domestic_use_usda: 'domestic_use_usda',
  domestic_use_eap: 'domestic_use_eap',
  exports_usda: 'exports_usda',
  exports_eap: 'exports_eap',
  ending_stocks_usda: 'ending_stocks_usda',
  ending_stocks_eap: 'ending_stocks_eap',
  projected: 'projected'
};

exports.Prisma.Us_export_salesScalarFieldEnum = {
  record_id: 'record_id',
  week_ending: 'week_ending',
  weekly_exports: 'weekly_exports',
  accumulated_exports: 'accumulated_exports',
  net_sales: 'net_sales',
  outstanding_sales: 'outstanding_sales',
  next_marketing_year_net_sales: 'next_marketing_year_net_sales',
  next_marketing_year_outstanding_sales: 'next_marketing_year_outstanding_sales'
};

exports.Prisma.Commitment_of_tradersScalarFieldEnum = {
  record_id: 'record_id',
  calendar_year: 'calendar_year',
  crop_year: 'crop_year',
  month: 'month',
  week: 'week',
  report_date_as_dd_mm_yyyy: 'report_date_as_dd_mm_yyyy',
  open_interest_all: 'open_interest_all',
  producer_merchant_net: 'producer_merchant_net',
  swap_position_net: 'swap_position_net',
  managed_money_long: 'managed_money_long',
  managed_money_short: 'managed_money_short',
  managed_money_net: 'managed_money_net',
  other_reportables_net: 'other_reportables_net',
  total_reportables_net: 'total_reportables_net',
  non_reportables_net: 'non_reportables_net',
  specs_net: 'specs_net'
};

exports.Prisma.Cotton_on_callScalarFieldEnum = {
  record_id: 'record_id',
  date: 'date',
  season_week: 'season_week',
  week: 'week',
  season: 'season',
  october_sales: 'october_sales',
  december_sales: 'december_sales',
  march_sales: 'march_sales',
  may_sales: 'may_sales',
  july_sales: 'july_sales',
  total_on_call_sales: 'total_on_call_sales',
  october_purchases: 'october_purchases',
  december_purchases: 'december_purchases',
  march_purchases: 'march_purchases',
  may_purchases: 'may_purchases',
  july_purchases: 'july_purchases',
  total_on_call_purchases: 'total_on_call_purchases',
  total_net_u_oc_position: 'total_net_u_oc_position',
  total_net_change: 'total_net_change'
};

exports.Prisma.CommentsScalarFieldEnum = {
  record_id: 'record_id',
  comment: 'comment',
  section: 'section',
  date_of_comment: 'date_of_comment',
  added_by: 'added_by'
};

exports.Prisma.Future_contracts_studyScalarFieldEnum = {
  record_id: 'record_id',
  year: 'year',
  month_of_high: 'month_of_high',
  date_of_high: 'date_of_high',
  high: 'high',
  month_of_low: 'month_of_low',
  date_of_low: 'date_of_low',
  low: 'low',
  price_range_between_high_and_low: 'price_range_between_high_and_low',
  day_range_between_high_and_low: 'day_range_between_high_and_low',
  inverse: 'inverse',
  comments: 'comments'
};

exports.Prisma.Cotton_contractsScalarFieldEnum = {
  record_id: 'record_id',
  datetime: 'datetime',
  contract: 'contract',
  high: 'high',
  low: 'low',
  open: 'open',
  close: 'close',
  change: 'change',
  rolling_average_200_day: 'rolling_average_200_day',
  rolling_average_100_day: 'rolling_average_100_day',
  rolling_average_50_day: 'rolling_average_50_day'
};

exports.Prisma.Monthly_indexScalarFieldEnum = {
  record_id: 'record_id',
  month: 'month',
  year: 'year',
  inverse_month: 'inverse_month',
  probability_rate: 'probability_rate'
};

exports.Prisma.Seasonal_indexScalarFieldEnum = {
  record_id: 'record_id',
  season: 'season',
  inverse_year: 'inverse_year',
  probability_rate: 'probability_rate'
};

exports.Prisma.Comparison_chartScalarFieldEnum = {
  record_id: 'record_id',
  date_of_close: 'date_of_close',
  cotton_spot_price: 'cotton_spot_price',
  dollar_basket_spot_price: 'dollar_basket_spot_price',
  crude_oil_spot_price: 'crude_oil_spot_price'
};

exports.Prisma.Snapshot_strategyScalarFieldEnum = {
  record_id: 'record_id',
  title_of_snapshot_strategy: 'title_of_snapshot_strategy',
  image_of_snapshot_strategy: 'image_of_snapshot_strategy',
  text_of_snapshot_strategy: 'text_of_snapshot_strategy',
  date_of_snapshot_strategy: 'date_of_snapshot_strategy',
  valid: 'valid',
  news_type: 'news_type',
  impact: 'impact',
  added_by: 'added_by',
  verified: 'verified'
};

exports.Prisma.Basis_comparisonScalarFieldEnum = {
  record_id: 'record_id',
  date_of_basis_report: 'date_of_basis_report',
  country: 'country',
  cost_type: 'cost_type',
  contract_december_2023: 'contract_december_2023',
  contract_december_2024: 'contract_december_2024',
  added_by: 'added_by'
};

exports.Prisma.In_country_newsScalarFieldEnum = {
  record_id: 'record_id',
  country: 'country',
  image_of_in_country_news: 'image_of_in_country_news',
  title_of_in_country_news: 'title_of_in_country_news',
  text_of_in_country_news: 'text_of_in_country_news',
  date_of_in_country_news: 'date_of_in_country_news',
  impact: 'impact',
  added_by: 'added_by',
  verified: 'verified'
};

exports.Prisma.Sentiment_surveyScalarFieldEnum = {
  record_id: 'record_id',
  bullish_or_bearish: 'bullish_or_bearish',
  bullish_or_bearish_value: 'bullish_or_bearish_value',
  high: 'high',
  low: 'low',
  intraday_average_points: 'intraday_average_points',
  open_interest: 'open_interest',
  date_of_survey: 'date_of_survey',
  added_by: 'added_by'
};

exports.Prisma.Comparison_charts_with_17_months_yearScalarFieldEnum = {
  record_id: 'record_id',
  season: 'season',
  low_price: 'low_price',
  date_of_low: 'date_of_low',
  month_of_low: 'month_of_low',
  calendar_week_of_low: 'calendar_week_of_low',
  high_price: 'high_price',
  date_of_high: 'date_of_high',
  month_of_high: 'month_of_high',
  calendar_week_of_high: 'calendar_week_of_high',
  range_between_high_low: 'range_between_high_low',
  rank_of_price_range: 'rank_of_price_range',
  percentage_rate_to_low: 'percentage_rate_to_low',
  day_range_between_high_low: 'day_range_between_high_low',
  rank_between_high_low: 'rank_between_high_low',
  inverse_season: 'inverse_season',
  us_seasonal_inflation: 'us_seasonal_inflation',
  us_inflation_cumm: 'us_inflation_cumm',
  us_interest_rate_mov: 'us_interest_rate_mov',
  us_interest_cumm: 'us_interest_cumm',
  world_population_cumm: 'world_population_cumm',
  world_population_mov: 'world_population_mov',
  world_acreage: 'world_acreage',
  world_acreage_movement: 'world_acreage_movement'
};

exports.Prisma.Temporary_StorageScalarFieldEnum = {
  record_id: 'record_id',
  data: 'data',
  created_at: 'created_at'
};

exports.Prisma.Report_TemplatesScalarFieldEnum = {
  record_id: 'record_id',
  name: 'name',
  data: 'data',
  company: 'company',
  created_at: 'created_at'
};

exports.Prisma.Dashboard_TemplatesScalarFieldEnum = {
  record_id: 'record_id',
  data: 'data',
  company: 'company',
  created_at: 'created_at'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  company: 'company',
  user_id: 'user_id',
  filetype: 'filetype',
  linkedType: 'linkedType',
  fileName: 'fileName',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Example: 'Example',
  Account: 'Account',
  Session: 'Session',
  Company: 'Company',
  VerificationToken: 'VerificationToken',
  User: 'User',
  Notification: 'Notification',
  Marketplace: 'Marketplace',
  MarketplaceAgent: 'MarketplaceAgent',
  MarketplaceBuyer: 'MarketplaceBuyer',
  a_index: 'a_index',
  fixed_cotton: 'fixed_cotton',
  unfixed_cotton: 'unfixed_cotton',
  strategy_log: 'strategy_log',
  producer_production_estimates: 'producer_production_estimates',
  producer_cost_estimates: 'producer_cost_estimates',
  producer_commercialisation_estimates: 'producer_commercialisation_estimates',
  bug_report: 'bug_report',
  suggestions: 'suggestions',
  upcoming_changes: 'upcoming_changes',
  conclusion: 'conclusion',
  Demo_Requests: 'Demo_Requests',
  General_Inquiries: 'General_Inquiries',
  things_to_review: 'things_to_review',
  External_Links: 'External_Links',
  supply_and_demand: 'supply_and_demand',
  us_export_sales: 'us_export_sales',
  commitment_of_traders: 'commitment_of_traders',
  cotton_on_call: 'cotton_on_call',
  comments: 'comments',
  future_contracts_study: 'future_contracts_study',
  cotton_contracts: 'cotton_contracts',
  monthly_index: 'monthly_index',
  seasonal_index: 'seasonal_index',
  comparison_chart: 'comparison_chart',
  snapshot_strategy: 'snapshot_strategy',
  basis_comparison: 'basis_comparison',
  in_country_news: 'in_country_news',
  sentiment_survey: 'sentiment_survey',
  comparison_charts_with_17_months_year: 'comparison_charts_with_17_months_year',
  Temporary_Storage: 'Temporary_Storage',
  Report_Templates: 'Report_Templates',
  Dashboard_Templates: 'Dashboard_Templates',
  Document: 'Document'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
