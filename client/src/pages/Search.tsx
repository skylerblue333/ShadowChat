// @ts-nocheck
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Search as SearchIcon, TrendingUp, Zap } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "marketplace" | "school" | "governance" | "charity" | "social" | "video">("all");
  const [showTrending, setShowTrending] = useState(true);

  const { data: searchResults, isLoading: isSearching } = trpc.search.globalSearch.useQuery(
    { query, category, limit: 20 },
    { enabled: query.length > 0 }
  );

  const { data: trendingData } = trpc.search.trendingSearches.useQuery();
  const { data: suggestionsData } = trpc.search.searchSuggestions.useQuery(
    { query },
    { enabled: query.length > 0 && query.length < 50 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTrending(false);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    setShowTrending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search SKYCOIN4444</h1>
          <p className="text-slate-400">Find courses, products, proposals, and more across all modules</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search across all modules..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 py-3 text-lg bg-slate-800/50 border-slate-700 focus:border-cyan-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {[
              { value: "all" as const, label: "All" },
              { value: "marketplace" as const, label: "Marketplace" },
              { value: "school" as const, label: "School" },
              { value: "governance" as const, label: "Governance" },
              { value: "charity" as const, label: "Charity" },
              { value: "social" as const, label: "Social" },
              { value: "video" as const, label: "Video" },
            ].map((cat) => (
              <Button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                variant={category === cat.value ? "default" : "outline"}
                className={category === cat.value ? "bg-cyan-600" : "border-slate-700"}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </form>

        {/* Suggestions */}
        {query.length > 0 && suggestionsData?.suggestions && suggestionsData.suggestions.length > 0 && (
          <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <p className="text-sm text-slate-400 mb-3">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionsData.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query.length > 0 ? (
          <div>
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
                <span className="ml-3 text-slate-400">Searching...</span>
              </div>
            ) : searchResults?.results && searchResults.results.length > 0 ? (
              <div>
                <p className="text-sm text-slate-400 mb-4">
                  Found {searchResults.totalResults} result{searchResults.totalResults !== 1 ? "s" : ""}
                </p>
                <div className="space-y-3">
                  {searchResults.results.map((result: any, idx) => (
                    <Card key={idx} className="bg-slate-800/50 border-slate-700/50 p-4 hover:border-slate-600/50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white">{result.title}</h3>
                            <Badge variant="secondary" className="text-xs">{result.type}</Badge>
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-2">{result.description}</p>
                          {result.category && (
                            <p className="text-xs text-slate-500 mt-2">Category: {result.category}</p>
                          )}
                          {result.price && (
                            <p className="text-xs text-cyan-400 mt-2">💰 {result.price} SKY444</p>
                          )}
                        </div>
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="bg-slate-800/30 border-slate-700/50 p-8 text-center">
                <p className="text-slate-400">No results found for "{query}"</p>
                <p className="text-sm text-slate-500 mt-2">Try different keywords or browse trending searches</p>
              </Card>
            )}
          </div>
        ) : showTrending && trendingData?.trending ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Trending Searches</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {trendingData.trending.map((trend: any, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTrendingClick(trend.term)}
                  className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-cyan-500/50 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white group-hover:text-cyan-400">{trend.term}</p>
                      <p className="text-xs text-slate-500 mt-1">{trend.count.toLocaleString()} searches</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{trend.category}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
