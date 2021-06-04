<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Infrastructure\ContentRepository;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\NodeTypePostprocessor\NodeTypePostprocessorInterface;

final class PropertyTypeForwarder implements NodeTypePostprocessorInterface
{
    /**
     * @param NodeType $nodeType
     * @param array<mixed> $configuration
     * @param array<mixed> $options
     * @return void
     */
    public function process(NodeType $nodeType, array &$configuration, array $options)
    {
        if (isset($configuration['properties'])) {
            foreach ($configuration['properties'] as &$property) {
                if (isset($property['ui']['inspector']['editor']) && $property['ui']['inspector']['editor'] === 'Sitegeist.InspectorGadget/Inspector/Editor') {
                    $property['ui']['inspector']['editorOptions']['type'] = $property['type'];
                }
            }
        }
    }
}
