<?php declare(strict_types=1);
namespace Sitegeist\InspectorGadget\Infrastructure\NodeInfo;

use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;

/**
 * @Flow\Aspect
 */
final class NodeInfoPostProcessingAspect
{

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    /**
     * @Flow\Around("method(Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper->renderNodeWithPropertiesAndChildrenInformation())")
     * @param JoinPointInterface $joinPoint
     * @return array<mixed>|null
     */
    public function postProcessRenderNodeWithPropertiesAndChildrenInformation(
        JoinPointInterface $joinPoint
    ) {
        $node = $joinPoint->getMethodArgument('node');
        $nodeTypeManager = $this->contentRepositoryRegistry->get($node->contentRepositoryId)->getNodeTypeManager();
        $nodeType = $nodeTypeManager->getNodeType($node->nodeTypeName);
        /** @var array<mixed>|null $result */
        $result = $joinPoint->getAdviceChain()->proceed($joinPoint);

        foreach ($result['properties'] ?? [] as $propertyName => &$convertedValue) {
            $editorName = $nodeType->getConfiguration(
                sprintf('properties.%s.ui.inspector.editor', $propertyName)
            );

            if ($editorName === 'Sitegeist.InspectorGadget/Inspector/Editor' && $node->getProperty($propertyName) instanceof \JsonSerializable) {
                $result['properties'][$propertyName] = $node->getProperty($propertyName);
            }
        }

        return $result;
    }
}
